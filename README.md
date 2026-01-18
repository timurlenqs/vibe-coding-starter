# Vibe Coding Starter

Next.js 16, TypeScript ve üretim seviyesinde uygulamalar geliştirmek için ihtiyacınız olan tüm araçlarla hızlı geliştirme için modern bir full-stack başlangıç kiti.

## 🚀 Yeni Özellik - Template Sistemi v1.0

### ✨ 33 Production-Ready Template

**Her bir AI agent uyumlu ve dokümante edilmiş!**

#### 📦 Template Kategorileri:

1. **Core Auth Templates** (4 template)
   - Login Page - Email/password form + validation
   - Register Page - Password strength indicator
   - Middleware - Route protection
   - Register API - User registration endpoint

2. **Dashboard Layout Templates** (4 template)
   - DashboardNavbar - Sticky navbar + blur effect
   - DashboardSidebar - Navigation menüsü
   - UserMenu - Kullanıcı dropdown menü
   - MobileMenu - Responsive sheet menu

3. **Dashboard Page Templates** (5 template)
   - Dashboard Home - İstatistikler + quick actions
   - Profile Page - Profil yönetimi
   - Settings Page - Tabs ile ayarlar
   - Billing Page - Stripe entegrasyonlu faturalandırma
   - Admin Page - Kullanıcı yönetim paneli

4. **API Route Templates** (5 template)
   - User API - CRUD operations
   - Profile API - Profil güncelleme
   - Password API - Şifre değiştirme
   - Stripe Checkout API - Ödeme işlemi
   - Stripe Webhook API - Webhook handler

5. **Database Schema Templates** (1 template)
   - Schema Extensions - Subscription, Invoice, AuditLog modelleri

6. **Email Templates** (4 template)
   - Welcome Email - Hoş geldin mesajı
   - Reset Password Email - Şifre sıfırlama
   - Invoice Email - Fatura bildirimi
   - Subscription Email - Abonelik yenileme

7. **Utility & Hook Templates** (6 template)
   - Validation Schemas - Zod validation
   - Stripe Utility - Helper fonksiyonlar
   - Email Utility - Email gönderme
   - useAuth Hook - Auth state management
   - useUser Hook - Kullanıcı işlemleri
   - useForm Hook - Form handling

8. **UI Component Templates** (5 template)
   - StatCard - İstatistik kartı
   - DataTable - Veri tablosu
   - EmptyState - Boş durum gösterimi
   - LoadingSpinner - Yükleme animasyonu
   - ErrorAlert - Hata bildirimi

### 🎯 Template Showcase Sayfası

Tüm template'leri görüntüleyin ve keşfedin:

```bash
npm run dev
# Git: http://localhost:3000/templates
```

**Showcase özellikleri:**
- 📊 8 kategoride 33 template
- 🔍 Her template için detaylı açıklama
- 🤖 Hazır AI agent prompt şablonları
- 📋 Tek tıkla kopyalanabilir prompt'lar
- ✅ Özellik listesi

### 🤖 AI Agent ile Kullanım

Her template için hazırlanmış prompt şablonu vardır. Bu şablonları kopyalayıp AI agent'larınıza (Claude Code, Cursor, GitHub Copilot) yapıştırın.

#### Adım Adım Kullanım:

**1. Template Showcase Sayfasını Açın:**
```
http://localhost:3000/templates
```

**2. İstediğiniz Template'i Seçin:**
- Kategoriye tıklayın
- Template'leri inceleyin
- Hazır prompt şablonunu kopyalayın

**3. AI Agent'a Gönderin:**
Kopyaladığınız prompt şablonunu AI agent prompt'unuza yapıştırın.

**Örnek Prompt:**
```
Dashboard login sayfası eklemek istiyorum.
@templates/core-auth-templates/PROMPT.md
Login page template'ini projeme entegre eder misin? Şunları da yap:
- src/app/login/page.tsx olarak kopyala
- Gerekli shadcn/ui component'lerini kontrol et (button, input, label, form)
- useToast hook'unun kullanıldığından emin ol
- NextAuth configuration'ı kontrol et (@/lib/auth)
```

**4. AI Agent Otomatik Yapar:**
- ✅ Gerekli template dosyalarını bulur
- ✅ Projenize entegre eder
- ✅ Bağımlılıkları ekler
- ✅ Kurulum adımlarını takip eder

## Teknoloji Yığını

- **Framework:** Next.js 16 (App Router, Server Components, Turbopack)
- **Dil:** TypeScript
- **Stil:** Tailwind CSS 4 + shadcn/ui
- **Veritabanı:** PostgreSQL ile Prisma ORM
- **Kimlik Doğrulama:** NextAuth.js ile Prisma Adapter
- **Backend:** Supabase
- **Ödemeler:** Stripe
- **E-posta:** React Email + Resend
- **Formlar:** React Hook Form + Zod doğrulama
- **UI:** Framer Motion, Lucide Icons, Sonner (bildirimler)
- **Veri:** TanStack Query, Recharts
- **Güvenlik:** reCAPTCHA v3

## Başlarken

### Ön Gereksinimler

- Node.js 18+
- PostgreSQL veritabanı (veya Supabase hesabı)
- Stripe hesabı (ödemeler için)
- Resend hesabı (e-postalar için)

### Kurulum

1. Depoyu klonlayın:

```bash
git clone https://github.com/eyaprak/vibe-coding-starter.git
cd vibe-coding-starter
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Ortam değişkenleri dosyasını kopyalayın:

```bash
cp .env.example .env
```

4. `.env` dosyasında ortam değişkenlerinizi yapılandırın:
   - Veritabanı URL'i (Supabase PostgreSQL)
   - Supabase kimlik bilgileri
   - NextAuth gizli anahtarı
   - Stripe anahtarları
   - Resend API anahtarı
   - reCAPTCHA anahtarları

5. Veritabanı şemasını gönderin:

```bash
npm run db:push
```

6. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

Uygulamanızı görmek için [http://localhost:3000](http://localhost:3000) adresini açın.

## Template Sistemi Kullanımı

### 🎨 Template Showcase Sayfası

```bash
npm run dev
# Git: http://localhost:3000/templates
```

### 📂 Manuel Template Kullanımı

```
templates/
├── PROMPT.md                 # Ana rehber (tüm sistem)
├── core-auth-templates/      # Auth template'leri
│   ├── PROMPT.md             # Kategori rehberi
│   ├── login-page.tsx        # Login template
│   ├── register-page.tsx     # Register template
│   └── ...
└── ...
```

**Adım Adım:**
1. İlgili template kategorisini açın
2. `PROMPT.md` dosyasını okuyun
3. Template dosyasını projenize kopyalayın
4. Kurulum adımlarını takip edin

### 🤖 AI Agent ile Örnek Kullanım

**Senaryo 1: Login Sayfası**
```
1. /templates sayfasına git
2. Core Authentication → Login Page'i seç
3. Prompt şablonunu kopyala:

Dashboard login sayfası eklemek istiyorum.
@templates/core-auth-templates/PROMPT.md
Login page template'ini projeme entegre eder misin?

→ AI agent:
- templates/core-auth-templates/login-page.tsx'i okur
- src/app/login/page.tsx olarak kopyalar
- Gerekli shadcn/ui component'lerini ekler
- Middleware'i kurar
- Test eder
```

**Senaryo 2: Dashboard Layout**
```
1. /templates sayfasına git
2. Dashboard Layout → Dashboard Navbar'ı seç
3. Prompt şablonunu kopyala:

Dashboard navbar component'i eklemek istiyorum.
@templates/dashboard-layout-templates/PROMPT.md
DashboardNavbar component'ini src/components/dashboard/navbar.tsx olarak ekler misin?

→ AI agent:
- Dashboard layout component'lerini ekler
- Layout dosyasını günceller
- Responsive tasarımı kontrol eder
```

**Senaryo 3: Profil Sayfasına Özellik Ekleme**
```
1. Mevcut profile-page.tsx'i kontrol et
2. Aşağıdaki prompt'u kullan:

Profil sayfasına telefon numarası field'ı eklemek istiyorum.
@templates/dashboard-page-templates/PROMPT.md

→ AI agent:
- Mevcut profile-page.tsx'i inceler
- Form field'ını ekler
- Validation schema'yı günceller
- API'yi günceller
- Prisma modelini günceller
```

## Proje Yapısı

```
├── prisma/
│   └── schema.prisma        # Veritabanı şeması
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API rotaları
│   │   ├── (dashboard)/     # Dashboard rota grubu
│   │   ├── templates/       # 🆕 Template showcase sayfası
│   │   ├── layout.tsx       # Ana layout
│   │   └── page.tsx         # Ana sayfa
│   ├── components/
│   │   └── ui/              # shadcn/ui bileşenleri
│   ├── hooks/               # Özel React hook'ları
│   ├── lib/                 # Yardımcı fonksiyonlar
│   │   ├── auth.ts          # NextAuth yapılandırması
│   │   ├── prisma.ts        # Prisma client
│   │   ├── supabase.ts      # Supabase client
│   │   └── utils.ts         # Yardımcı fonksiyonlar
│   └── types/               # TypeScript tipleri
├── templates/               # 🆕 Tüm template şablonları
│   ├── PROMPT.md            # Ana AI agent rehberi
│   ├── core-auth-templates/
│   ├── dashboard-layout-templates/
│   ├── dashboard-page-templates/
│   ├── api-route-templates/
│   ├── database-schema-templates/
│   ├── email-templates/
│   ├── utility-hook-templates/
│   └── ui-component-templates/
└── public/                  # Statik dosyalar
```

## Kullanılabilir Komutlar

| Komut                 | Açıklama                                   |
| --------------------- | ------------------------------------------ |
| `npm run dev`         | Turbopack ile geliştirme sunucusunu başlat |
| `npm run build`       | Üretim için derle                          |
| `npm run start`       | Üretim sunucusunu başlat                   |
| `npm run lint`        | ESLint'i çalıştır                          |
| `npm run db:push`     | Prisma şemasını veritabanına gönder        |
| `npm run db:generate` | Prisma client'ı oluştur                    |

## Özellikler

### 🆕 Template Sistemi

- **33 Ready-to-Use Template** - Her biri production ready
- **AI Agent Uyumlu** - Claude Code, Cursor, Copilot ile çalışır
- **Kategorize Edilmiş** - 8 ana kategori
- **Dokümante Edilmiş** - Her template'te JSDoc comments
- **Prompt Şablonları** - Hazır AI agent prompt'ları
- **Detaylı Açıklamalar** - Her template için özellik listesi

### Kimlik Doğrulama

- Kimlik bilgisi tabanlı kimlik doğrulama
- JWT ile oturum yönetimi
- Korumalı rotalar hazır

### Veritabanı

- Roller ile kullanıcı modeli (USER, ADMIN)
- OAuth için hesap bağlama
- Oturum yönetimi

### Ödemeler (Stripe)

- Client ve server SDK hazır
- Webhook işleme kurulumu

### E-posta

- React Email bileşenleri
- Resend entegrasyonu

### UI Bileşenleri

- Button, Input, Card bileşenleri
- Karanlık mod desteği
- Bildirim mesajları

## Özelleştirme

### shadcn/ui Bileşenleri Ekleme

```bash
npx shadcn@latest add [bileşen-adı]
```

### Veritabanı Migrasyonları

`prisma/schema.prisma` dosyasını değiştirdikten sonra:

```bash
npx prisma db push
```

## Dağıtım

### Vercel (Önerilen)

1. GitHub'a gönderin
2. Vercel'de projeyi içe aktarın
3. Ortam değişkenlerini yapılandırın
4. Dağıtın

### Diğer Platformlar

Üretim paketini derleyin:

```bash
npm run build
npm run start
```

## Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen bir issue açın veya pull request gönderin.

## Lisans

MIT Lisansı - bu starter'ı herhangi bir proje için kullanmakta özgürsünüz.

---

**⭐ Eğer bu proje işinize yaradıysa, lütfen bir yıldız vermeyi unutmayın!**
