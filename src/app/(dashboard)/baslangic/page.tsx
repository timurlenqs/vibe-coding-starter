import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiDatabase, FiLock, FiCreditCard, FiMail, FiShield, FiLayout } from "react-icons/fi";

const tasks = [
  {
    icon: FiDatabase,
    title: "Veritabanı Kurulumu",
    description: "Supabase'de PostgreSQL veritabanı oluştur",
    steps: [
      "supabase.com'da yeni proje oluştur",
      "Connection string'i .env dosyasına ekle",
      "npx prisma db push ile tabloları oluştur",
    ],
    status: "required",
  },
  {
    icon: FiLock,
    title: "Kimlik Doğrulama",
    description: "NextAuth.js ile kullanıcı girişi",
    steps: [
      "NEXTAUTH_SECRET oluştur (openssl rand -base64 32)",
      "/api/auth endpoint'leri hazır",
      "Giriş/Kayıt sayfaları oluştur",
    ],
    status: "required",
  },
  {
    icon: FiCreditCard,
    title: "Ödeme Sistemi",
    description: "Stripe ile ödeme alma",
    steps: [
      "stripe.com'da hesap oluştur",
      "API anahtarlarını .env'e ekle",
      "Webhook endpoint'i oluştur",
    ],
    status: "optional",
  },
  {
    icon: FiMail,
    title: "E-posta Servisi",
    description: "Resend ile e-posta gönderimi",
    steps: [
      "resend.com'da hesap oluştur",
      "API anahtarını .env'e ekle",
      "E-posta şablonları oluştur",
    ],
    status: "optional",
  },
  {
    icon: FiShield,
    title: "reCAPTCHA",
    description: "Bot koruması için Google reCAPTCHA v3",
    steps: [
      "Google reCAPTCHA konsolunda site oluştur",
      "Site ve secret key'leri .env'e ekle",
      "Formlara reCAPTCHA ekle",
    ],
    status: "optional",
  },
  {
    icon: FiLayout,
    title: "UI Bileşenleri",
    description: "shadcn/ui ile hazır bileşenler",
    steps: [
      "npx shadcn@latest add [bileşen-adı]",
      "Button, Input, Card hazır",
      "components.json yapılandırıldı",
    ],
    status: "ready",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Yapılacaklar</h1>
          <p className="text-muted-foreground">
            Projeyi tamamlamak için aşağıdaki adımları takip et
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.title} className="relative overflow-hidden">
              {task.status === "ready" && (
                <div className="absolute top-3 right-3 rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-500">
                  Hazır
                </div>
              )}
              {task.status === "required" && (
                <div className="absolute top-3 right-3 rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-500">
                  Gerekli
                </div>
              )}
              {task.status === "optional" && (
                <div className="absolute top-3 right-3 rounded-full bg-yellow-500/20 px-2 py-1 text-xs text-yellow-500">
                  Opsiyonel
                </div>
              )}
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <task.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <CardDescription>{task.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {task.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                      {step}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Başlangıç</CardTitle>
              <CardDescription>
                Terminal komutları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 font-mono text-sm">
                <div className="rounded-lg bg-muted p-3">
                  <span className="text-muted-foreground"># .env dosyasını oluştur</span>
                  <br />
                  cp .env.example .env
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <span className="text-muted-foreground"># Veritabanı tablolarını oluştur</span>
                  <br />
                  npx prisma db push
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <span className="text-muted-foreground"># Geliştirme sunucusunu başlat</span>
                  <br />
                  npm run dev
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
