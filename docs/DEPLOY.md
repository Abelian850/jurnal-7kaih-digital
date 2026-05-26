# 📚 Panduan Deploy — Jurnal 7KAIH Digital
**Author: Abyss Walker (AW)**

---

## 🚀 Persiapan Awal

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/username/jurnal-7kaih-digital.git
cd jurnal-7kaih-digital
npm install
```

---

## ☁️ Setup Cloudflare

### 2. Buat Akun Cloudflare
- Daftar di https://dash.cloudflare.com
- Aktifkan **Cloudflare Pages** dan **D1 Database**

### 3. Install Wrangler CLI

```bash
npm install -g wrangler
wrangler login
```

### 4. Buat Database D1

```bash
# Buat database
wrangler d1 create jurnal-7kaih-db

# Catat output: database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
# Masukkan ke wrangler.toml
```

### 5. Jalankan Migrasi Database

```bash
# Local (development)
wrangler d1 execute jurnal-7kaih-db --local --file=drizzle/0000_initial.sql

# Production
wrangler d1 execute jurnal-7kaih-db --file=drizzle/0000_initial.sql
```

### 6. Seed Data Awal

```bash
# Jalankan seed script untuk melihat SQL
npx tsx scripts/seed.ts

# Copy SQL output → Cloudflare Dashboard → D1 → Console → Paste & Execute
```

---

## 🔐 Setup Google Apps Script (Upload Foto)

### 7. Siapkan Google Drive Folder

1. Buka https://drive.google.com
2. Buat folder baru: **"Jurnal 7KAIH Foto"**
3. Buka folder → copy **Folder ID** dari URL:
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID_DISINI]
   ```

### 8. Deploy Google Apps Script

1. Buka https://script.google.com
2. Klik **New Project**
3. Hapus kode default, paste isi file `scripts/google-apps-script.js`
4. Ganti:
   ```javascript
   const FOLDER_ID = "paste-folder-id-disini";
   const SECRET_TOKEN = "buat-token-acak-kuat"; // contoh: "Jrn7KA1H_s3cr3t_2024"
   ```
5. Klik **Deploy** → **New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Klik **Deploy** → **Authorize** jika diminta
7. Copy **Web App URL**

### 9. Test Apps Script

```bash
curl "https://script.google.com/macros/s/SCRIPT_ID/exec?token=YOUR_TOKEN"
# Response: {"success":true,"message":"Jurnal 7KAIH Upload Service Active",...}
```

---

## ⚙️ Environment Variables

### 10. Buat file `.env.local`

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Auth secret (generate: openssl rand -base64 32)
AUTH_SECRET=generated-secret-here

# Google Apps Script
NEXT_PUBLIC_GAS_URL=https://script.google.com/macros/s/SCRIPT_ID/exec
NEXT_PUBLIC_GAS_TOKEN=your-secret-token

# Cloudflare D1 (untuk drizzle-kit migrations)
CLOUDFLARE_ACCOUNT_ID=your-account-id
CLOUDFLARE_DATABASE_ID=your-database-id
CLOUDFLARE_D1_TOKEN=your-api-token
```

---

## 🛠️ Development

### 11. Jalankan Local Dev

```bash
npm run dev
# Buka http://localhost:3000

# Login dengan:
# Username: admin | Password: admin123
# Username: siti_aminah | Password: guru123
```

---

## 🌐 Deploy ke Cloudflare Pages

### 12. Push ke GitHub

```bash
git add .
git commit -m "initial commit"
git push origin main
```

### 13. Connect ke Cloudflare Pages

1. Buka https://dash.cloudflare.com → **Pages**
2. Klik **Create a project** → **Connect to Git**
3. Pilih repository
4. Build settings:
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .vercel/output/static
   ```

### 14. Set Environment Variables di Cloudflare

Pages → Project → **Settings** → **Environment variables**:

| Variable | Value |
|----------|-------|
| `AUTH_SECRET` | your-secret |
| `NEXT_PUBLIC_GAS_URL` | https://script.google.com/... |
| `NEXT_PUBLIC_GAS_TOKEN` | your-token |

### 15. Bind D1 Database

Pages → Project → **Settings** → **Functions** → **D1 database bindings**:

| Variable name | D1 database |
|---------------|-------------|
| `DB` | jurnal-7kaih-db |

### 16. Custom Domain (Opsional)

Pages → Project → **Custom domains** → Add domain

---

## 🔄 Update & Re-deploy

```bash
# Edit kode
git add .
git commit -m "update feature"
git push origin main
# Cloudflare Pages auto-deploy dari push
```

### Migrasi database baru:

```bash
# Buat migrasi
npm run db:generate

# Apply ke production
wrangler d1 execute jurnal-7kaih-db --file=drizzle/NAMA_MIGRATION.sql
```

---

## 📊 Akun Default

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Guru Wali | `siti_aminah` | `guru123` |
| Guru Wali | `ahmad_fathoni` | `guru123` |

> ⚠️ **Ganti password default segera setelah deploy production!**

---

## 🐛 Troubleshooting

### Error: D1 Database not found
```bash
# Pastikan binding di wrangler.toml sudah benar
wrangler d1 list  # Cek list database
```

### Error: Auth Secret tidak valid
```bash
# Generate ulang secret
openssl rand -base64 32
```

### Error: Upload foto gagal
- Cek Apps Script sudah di-deploy sebagai **Web App**
- Pastikan **FOLDER_ID** valid
- Pastikan **TOKEN** sama di Apps Script dan `.env.local`

### Build error: Module not found
```bash
npm install  # Install ulang dependencies
npm run build  # Test build lokal
```

---

## 📁 Struktur Folder

```
jurnal7kaih/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/              # Halaman admin
│   │   ├── guru/               # Halaman guru wali
│   │   ├── login/              # Halaman login
│   │   └── api/auth/           # Auth API routes
│   ├── components/
│   │   ├── auth/               # Login form
│   │   ├── dashboard/          # Dashboard widgets
│   │   ├── guru/               # Komponen guru wali
│   │   ├── import/             # Import CSV/Excel
│   │   ├── jurnal/             # Tabel & form jurnal
│   │   ├── layout/             # Sidebar layout
│   │   ├── shared/             # Skeleton, theme
│   │   └── siswa/              # Tabel & form siswa
│   └── lib/
│       ├── actions/            # Server Actions
│       ├── auth/               # Auth.js config
│       ├── db/                 # Drizzle ORM + schema
│       ├── utils/              # Helpers
│       └── validations/        # Zod schemas
├── drizzle/                    # SQL migrations
├── scripts/                    # Seed + Apps Script
├── public/                     # Static assets
├── wrangler.toml               # Cloudflare config
└── .env.example                # Contoh env vars
```

---

*Developed by **Abyass Walker (AW)** — Jurnal 7KAIH Digital*
