# CRM Project

## Cara Setup Project

1. **Clone repository**
   ```bash
   git clone <repo-url>
   cd CRM
   ```

2. **Install dependencies**
   ```bash
   composer install
   npm install
   ```

3. **Copy file environment**
   ```bash
   cp .env.example .env
   ```

4. **Generate application key**
   ```bash
   php artisan key:generate
   ```

5. **Atur koneksi database**  
   Edit file `.env` dan sesuaikan konfigurasi database Anda.

6. **Jalankan migrasi dan seeder**
   ```bash
   php artisan migrate --seed
   ```

7. **Build frontend**
   ```bash
   npm run dev
   ```
   atau untuk production:
   ```bash
   npm run build
   ```

8. **Jalankan server**
   ```bash
   php artisan serve
   ```

---

## Akun Untuk Login

| Role         | Email              | Password  |
|--------------|--------------------|-----------|
| Super Admin  | admin@demo.com     | password  |
| Manager      | manager@demo.com   | password  |
| Sales        | sales@demo.com     | password  |

---

## Catatan

- Pastikan sudah menjalankan `php artisan migrate --seed` agar akun di atas tersedia.
- Untuk fitur login Google, pastikan sudah mengatur credential Google OAuth di `.env` jika diperlukan.