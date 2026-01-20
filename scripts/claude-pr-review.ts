import Anthropic from "@anthropic-ai/sdk";
import { Octokit } from "@octokit/rest";

// Types
interface InlineComment {
  file: string;
  line: number;
  severity: "critical" | "warning" | "suggestion";
  message: string;
}

interface ReviewResponse {
  summary: string;
  approved: boolean;
  comments: InlineComment[];
}

interface PRFile {
  filename: string;
  status: string;
  patch?: string;
  additions: number;
  deletions: number;
}

// Configuration
const CONFIG = {
  model: "claude-sonnet-4-20250514" as const,
  maxTokens: 4096,
  maxDiffLength: 100000,
  skipPatterns: [
    /package-lock\.json$/,
    /yarn\.lock$/,
    /pnpm-lock\.yaml$/,
    /\.lock$/,
    /\.generated\./,
    /\.min\.(js|css)$/,
    /dist\//,
    /build\//,
    /node_modules\//,
  ],
};

// Environment variables
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const PR_NUMBER = parseInt(process.env.PR_NUMBER || "0", 10);
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

// Validate environment
function validateEnv(): void {
  const missing: string[] = [];
  if (!GITHUB_TOKEN) missing.push("GITHUB_TOKEN");
  if (!ANTHROPIC_API_KEY) missing.push("ANTHROPIC_API_KEY");
  if (!PR_NUMBER) missing.push("PR_NUMBER");
  if (!REPO_OWNER) missing.push("REPO_OWNER");
  if (!REPO_NAME) missing.push("REPO_NAME");

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

// Initialize clients
const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
const octokit = new Octokit({ auth: GITHUB_TOKEN });

// Check if file should be skipped
function shouldSkipFile(filename: string): boolean {
  return CONFIG.skipPatterns.some((pattern) => pattern.test(filename));
}

// Fetch PR details and files
async function fetchPRData(): Promise<{
  title: string;
  body: string;
  head: string;
  base: string;
  files: PRFile[];
}> {
  const [prResponse, filesResponse] = await Promise.all([
    octokit.pulls.get({
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      pull_number: PR_NUMBER,
    }),
    octokit.pulls.listFiles({
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      pull_number: PR_NUMBER,
      per_page: 100,
    }),
  ]);

  const files = filesResponse.data
    .filter((file) => !shouldSkipFile(file.filename))
    .map((file) => ({
      filename: file.filename,
      status: file.status,
      patch: file.patch,
      additions: file.additions,
      deletions: file.deletions,
    }));

  return {
    title: prResponse.data.title,
    body: prResponse.data.body || "",
    head: prResponse.data.head.ref,
    base: prResponse.data.base.ref,
    files,
  };
}

// Build the diff content for Claude
function buildDiffContent(files: PRFile[]): string {
  let diffContent = "";
  let totalLength = 0;

  for (const file of files) {
    if (!file.patch) continue;

    const fileSection = `\n### ${file.filename} (${file.status})\n\`\`\`diff\n${file.patch}\n\`\`\`\n`;

    if (totalLength + fileSection.length > CONFIG.maxDiffLength) {
      diffContent += "\n\n[... diff truncated due to size limits ...]\n";
      break;
    }

    diffContent += fileSection;
    totalLength += fileSection.length;
  }

  return diffContent;
}

// Build the review prompt
function buildPrompt(prData: {
  title: string;
  body: string;
  head: string;
  base: string;
  files: PRFile[];
}): string {
  const diffContent = buildDiffContent(prData.files);

  return `You are an expert code reviewer. Your task is to review this pull request comprehensively and provide actionable feedback.

## Review Criteria

Analyze the code changes for:

1. **Code Quality**
   - Logic errors and potential bugs
   - Code smells and maintainability issues
   - Proper error handling
   - Code readability and clarity

2. **Security**
   - SQL injection, XSS, command injection vulnerabilities
   - Improper authentication/authorization
   - Sensitive data exposure
   - OWASP Top 10 vulnerabilities

3. **Performance**
   - Inefficient algorithms or data structures
   - Memory leaks
   - N+1 query problems
   - Unnecessary re-renders (React)

4. **Best Practices**
   - TypeScript type safety
   - React/Next.js conventions
   - Proper async/await usage
   - Code organization and architecture

## Pull Request Information

**Title:** ${prData.title}
**Description:** ${prData.body || "No description provided"}
**Branch:** ${prData.head} → ${prData.base}
**Files Changed:** ${prData.files.length}

## Changed Files

${diffContent}

## Response Format

Respond with a valid JSON object (no markdown code blocks) in this exact format:

{
  "summary": "A concise summary of the review findings (2-4 sentences). Mention what the PR does well and what needs improvement.",
  "approved": true/false,
  "comments": [
    {
      "file": "path/to/file.ts",
      "line": 42,
      "severity": "critical|warning|suggestion",
      "message": "Detailed explanation of the issue and how to fix it"
    }
  ]
}

Guidelines for your response:
- Set "approved" to false if there are any critical issues
- Only include comments for actual issues found - don't create comments just to have something
- Use "critical" for bugs, security issues, or breaking changes
- Use "warning" for code smells, performance issues, or potential problems
- Use "suggestion" for style improvements or minor enhancements
- The "line" should be a line number from the diff that appears in the added lines (lines starting with +)
- Be specific and actionable in your feedback
- If the PR looks good with no issues, set approved to true and leave comments empty`;
}

// Parse Claude's response
function parseResponse(content: string): ReviewResponse {
  try {
    // Remove potential markdown code blocks
    const cleaned = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    // Validate structure
    if (typeof parsed.summary !== "string") {
      throw new Error("Invalid summary");
    }
    if (typeof parsed.approved !== "boolean") {
      throw new Error("Invalid approved field");
    }
    if (!Array.isArray(parsed.comments)) {
      parsed.comments = [];
    }

    // Validate and filter comments
    parsed.comments = parsed.comments.filter(
      (c: unknown): c is InlineComment =>
        typeof c === "object" &&
        c !== null &&
        typeof (c as InlineComment).file === "string" &&
        typeof (c as InlineComment).line === "number" &&
        typeof (c as InlineComment).message === "string" &&
        ["critical", "warning", "suggestion"].includes((c as InlineComment).severity)
    );

    return parsed as ReviewResponse;
  } catch (error) {
    console.error("Failed to parse Claude response:", error);
    console.error("Raw content:", content);

    // Return a fallback response
    return {
      summary: "Unable to parse review response. Please review manually.",
      approved: false,
      comments: [],
    };
  }
}

// Get severity emoji
function getSeverityEmoji(severity: InlineComment["severity"]): string {
  switch (severity) {
    case "critical":
      return "🚨";
    case "warning":
      return "⚠️";
    case "suggestion":
      return "💡";
  }
}

// Post review to GitHub
async function postReview(review: ReviewResponse, files: PRFile[]): Promise<void> {
  // Build the review body
  const criticalCount = review.comments.filter((c) => c.severity === "critical").length;
  const warningCount = review.comments.filter((c) => c.severity === "warning").length;
  const suggestionCount = review.comments.filter((c) => c.severity === "suggestion").length;

  let body = `## 🤖 Claude Code Review\n\n`;
  body += `${review.summary}\n\n`;

  if (review.comments.length > 0) {
    body += `### Summary\n`;
    body += `- 🚨 Critical: ${criticalCount}\n`;
    body += `- ⚠️ Warnings: ${warningCount}\n`;
    body += `- 💡 Suggestions: ${suggestionCount}\n\n`;
  }

  if (review.approved) {
    body += `✅ **This PR looks good to merge!**\n`;
  } else {
    body += `❌ **Changes requested - please address the issues above.**\n`;
  }

  body += `\n---\n*Powered by Claude AI*`;

  // Build inline comments for the review
  const reviewComments: Array<{
    path: string;
    line: number;
    body: string;
  }> = [];

  // Create a map of files to their available lines from the diff
  const fileLineMap = new Map<string, Set<number>>();
  for (const file of files) {
    if (!file.patch) continue;

    const lines = new Set<number>();
    let lineNumber = 0;

    for (const line of file.patch.split("\n")) {
      // Parse the @@ header to get line numbers
      const hunkMatch = line.match(/@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (hunkMatch) {
        lineNumber = parseInt(hunkMatch[1], 10) - 1;
        continue;
      }

      // Track added and context lines
      if (!line.startsWith("-")) {
        lineNumber++;
        if (line.startsWith("+") || !line.startsWith("\\")) {
          lines.add(lineNumber);
        }
      }
    }

    fileLineMap.set(file.filename, lines);
  }

  // Filter and add comments
  for (const comment of review.comments) {
    const fileLines = fileLineMap.get(comment.file);
    if (!fileLines) {
      console.warn(`File not found in diff: ${comment.file}`);
      continue;
    }

    // Find the closest valid line if the exact line isn't available
    let targetLine = comment.line;
    if (!fileLines.has(targetLine)) {
      const linesArray = Array.from(fileLines).sort((a, b) => a - b);
      const closest = linesArray.reduce((prev, curr) =>
        Math.abs(curr - targetLine) < Math.abs(prev - targetLine) ? curr : prev
      );
      targetLine = closest;
    }

    if (fileLines.has(targetLine)) {
      reviewComments.push({
        path: comment.file,
        line: targetLine,
        body: `${getSeverityEmoji(comment.severity)} **${comment.severity.toUpperCase()}**\n\n${comment.message}`,
      });
    }
  }

  // Determine review event
  let event: "APPROVE" | "REQUEST_CHANGES" | "COMMENT";
  if (review.approved && review.comments.length === 0) {
    event = "APPROVE";
  } else if (!review.approved || criticalCount > 0) {
    event = "REQUEST_CHANGES";
  } else {
    event = "COMMENT";
  }

  // Submit the review
  try {
    await octokit.pulls.createReview({
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      pull_number: PR_NUMBER,
      body,
      event,
      comments: reviewComments,
    });

    console.log(`Review submitted successfully (${event})`);
    console.log(`- Summary posted`);
    console.log(`- ${reviewComments.length} inline comments posted`);
  } catch (error) {
    console.error("Failed to create review:", error);

    // Fallback: post as a simple comment
    await octokit.issues.createComment({
      owner: REPO_OWNER!,
      repo: REPO_NAME!,
      issue_number: PR_NUMBER,
      body: body + "\n\n*Note: Unable to post inline comments*",
    });

    console.log("Fallback: Posted as issue comment");
  }
}

// Main function
async function main(): Promise<void> {
  console.log("Starting Claude PR Review...");
  console.log(`Repository: ${REPO_OWNER}/${REPO_NAME}`);
  console.log(`PR Number: ${PR_NUMBER}`);

  try {
    // Validate environment
    validateEnv();

    // Fetch PR data
    console.log("\nFetching PR data...");
    const prData = await fetchPRData();
    console.log(`Title: ${prData.title}`);
    console.log(`Files to review: ${prData.files.length}`);

    if (prData.files.length === 0) {
      console.log("No files to review (all files skipped)");
      return;
    }

    // Build prompt and call Claude
    console.log("\nSending to Claude for review...");
    const prompt = buildPrompt(prData);

    const message = await anthropic.messages.create({
      model: CONFIG.model,
      max_tokens: CONFIG.maxTokens,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text content
    const textContent = message.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse response
    console.log("\nParsing review response...");
    const review = parseResponse(textContent.text);

    console.log(`Summary: ${review.summary.substring(0, 100)}...`);
    console.log(`Approved: ${review.approved}`);
    console.log(`Comments: ${review.comments.length}`);

    // Post review to GitHub
    console.log("\nPosting review to GitHub...");
    await postReview(review, prData.files);

    console.log("\nReview completed successfully!");
  } catch (error) {
    console.error("\nError during review:", error);

    // Try to post an error comment
    if (GITHUB_TOKEN && REPO_OWNER && REPO_NAME && PR_NUMBER) {
      try {
        const errorOctokit = new Octokit({ auth: GITHUB_TOKEN });
        await errorOctokit.issues.createComment({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          issue_number: PR_NUMBER,
          body: `## 🤖 Claude Code Review\n\n❌ **Review failed**\n\nAn error occurred while reviewing this PR. Please review manually.\n\nError: ${error instanceof Error ? error.message : "Unknown error"}\n\n---\n*Powered by Claude AI*`,
        });
      } catch {
        console.error("Failed to post error comment");
      }
    }

    process.exit(1);
  }
}

// Run
main();
