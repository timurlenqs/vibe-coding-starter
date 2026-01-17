import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Vibe Coding Starter
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Next.js 16, TypeScript, Tailwind CSS, Prisma, Supabase, Stripe ve daha fazlasıyla
            modern full-stack başlangıç kiti. Bugün projene başla.
          </p>

          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/baslangic">Başla</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/yourusername/vibe-coding-starter"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Next.js 16</CardTitle>
              <CardDescription>
                App Router, Server Components ve Turbopack ile ışık hızında geliştirme.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kimlik Doğrulama</CardTitle>
              <CardDescription>
                Prisma adaptörlü NextAuth.js. Credentials ve OAuth desteği.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Veritabanı</CardTitle>
              <CardDescription>
                PostgreSQL/Supabase ile Prisma ORM. Tip güvenli veritabanı sorguları.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ödemeler</CardTitle>
              <CardDescription>
                Abonelik ve tek seferlik ödemeler için hazır Stripe entegrasyonu.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>E-posta</CardTitle>
              <CardDescription>
                Güzel işlemsel e-postalar için React Email ve Resend.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UI Bileşenleri</CardTitle>
              <CardDescription>
                Tailwind CSS ile shadcn/ui bileşenleri. Karanlık mod dahil.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </main>
  );
}
