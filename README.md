# 📖 Jurnal 7KAIH Digital

> Sistem Jurnal Siswa Modern berbasis Guru Wali untuk Sekolah/Madrasah

**Author: Abyass Walker (AW)**

---

## ✨ Fitur Utama

| Fitur | Admin | Guru Wali |
|-------|:-----:|:---------:|
| Dashboard statistik & grafik | ✅ | ✅ |
| Manajemen guru wali | ✅ | — |
| Manajemen siswa | ✅ | — |
| Input jurnal siswa | ✅ | ✅ |
| Import CSV/Excel massal | ✅ | — |
| Export PDF/Excel | ✅ | ✅ |
| Upload foto dokumentasi | ✅ | ✅ |
| Filter & pencarian | ✅ | ✅ |
| Dark mode | ✅ | ✅ |
| Reset password | ✅ | — |

---

## 🛠 Tech Stack

- **Frontend**: Next.js 15 App Router + TypeScript + TailwindCSS
- **UI**: shadcn/ui + Radix UI + Lucide Icons
- **Database**: Cloudflare D1 + Drizzle ORM
- **Auth**: Auth.js (NextAuth v5) + bcrypt
- **Charts**: Recharts
- **Tables**: TanStack Table
- **Storage**: Google Drive via Apps Script
- **Deploy**: Cloudflare Pages

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env.local
# Edit .env.local dengan kredensial Anda
npm run dev
```

---

## 📖 Dokumentasi Deploy

Lihat [docs/DEPLOY.md](docs/DEPLOY.md) untuk panduan lengkap.

---

## 🔐 Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Guru Wali | `siti_aminah` | `guru123` |

> ⚠️ Ganti password segera setelah deploy!

---

*Developed with ❤️ by **Abyss Walker (AW)***
