# คู่มือการตั้งค่า GitHub OAuth และ Blog Editor

## ขั้นตอนที่ 1: สร้าง GitHub OAuth App

1. ไปที่ https://github.com/settings/developers
2. คลิก "OAuth Apps" ทางด้านซ้าย
3. คลิก "New OAuth App"
4. กรอกข้อมูล:
   - **Application name**: `Your Blog Name`
   - **Homepage URL**: `https://sarakhanx.github.io/yard`
   - **Authorization callback URL**: `https://sarakhanx.github.io/yard/api/auth/callback/github`
5. คลิก "Register application"
6. คัดลอก **Client ID**
7. คลิก "Generate a new client secret" และคัดลอก **Client Secret**

## ขั้นตอนที่ 2: สร้างไฟล์ `.env`

สร้างไฟล์ `.env` ใน root directory ของโปรเจกต์:

```bash
# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# Auth Secret (generate with: openssl rand -hex 32)
AUTH_SECRET=your_random_secret_here

# Trust host for OAuth
AUTH_TRUST_HOST=true

# Your GitHub username (for admin access)
ADMIN_GITHUB_USERNAME=your_github_username_here

# Site URL
SITE=https://sarakhanx.github.io
BASE_PATH=/yard
```

### วิธีสร้าง AUTH_SECRET:

```bash
openssl rand -hex 32
```

## ขั้นตอนที่ 3: ติดตั้ง Dependencies

```bash
npm install
```

## ขั้นตอนที่ 4: รัน Development Server

```bash
npm run dev
```

## การใช้งาน

### สำหรับผู้เข้าชม (ทุกคนที่มี GitHub Account):

1. เข้าไปที่ blog post ใดก็ได้
2. scroll ลงมาที่ส่วน Comments
3. คลิก "Sign in with GitHub"
4. อนุญาตให้แอปเข้าถึง GitHub account ของคุณ
5. เขียน comment และกด "Post Comment"

### สำหรับ Admin (เฉพาะเจ้าของ blog):

1. Sign in ด้วย GitHub account ที่ตรงกับ `ADMIN_GITHUB_USERNAME` ใน `.env`
2. เข้าไปที่ `/auth/blog` (เช่น `http://localhost:4321/auth/blog`)
3. เขียน blog post ใหม่:
   - **Title**: หัวข้อของ blog post
   - **Slug**: URL-friendly slug (จะถูกสร้างอัตโนมัติจาก title)
   - **Content**: เนื้อหาในรูปแบบ Markdown
4. คลิก "Preview" เพื่อดูตัวอย่าง
5. คลิก "Publish Post" เพื่อเผยแพร่

## โครงสร้างไฟล์ที่สำคัญ

```
/workspace/
├── src/
│   ├── components/
│   │   ├── Comments.tsx          # Comment component
│   │   └── Comments.css          # Comment styles
│   ├── layouts/
│   │   └── BlogPost.astro        # Blog post layout with comments
│   ├── lib/
│   │   └── db.ts                 # Database operations
│   ├── pages/
│   │   ├── api/
│   │   │   ├── auth/[...auth].ts # Auth endpoints
│   │   │   ├── comments/[slug].ts # Comments API
│   │   │   └── posts/            # Posts API
│   │   └── auth/
│   │       ├── signin.astro      # Sign in page
│   │       └── blog.astro        # Blog editor (admin only)
│   └── middleware.ts             # Route protection
├── auth.config.ts                # Auth configuration
├── blog.db                       # SQLite database (auto-created)
└── .env                          # Environment variables
```

## Features

✅ **GitHub OAuth Authentication** - ใช้ GitHub account ในการ sign in
✅ **Comment System** - ทุกคนที่ sign in สามารถ comment ได้
✅ **Blog Editor** - Text editor สำหรับเขียน blog ใหม่
✅ **Admin-only Access** - เฉพาะ admin เท่านั้นที่สามารถเขียน blog ได้
✅ **SQLite Database** - เก็บข้อมูล comments และ posts
✅ **Markdown Support** - เขียน blog ด้วย Markdown
✅ **Responsive Design** - รองรับทุกขนาดหน้าจอ

## API Endpoints

### Authentication
- `GET/POST /api/auth/[...auth]` - Auth endpoints (signin, signout, callback)

### Comments
- `GET /api/comments/[slug]` - ดึง comments ของ post
- `POST /api/comments/[slug]` - สร้าง comment ใหม่ (ต้อง authenticate)

### Posts
- `GET /api/posts` - ดึงรายการ posts ทั้งหมด
- `POST /api/posts` - สร้าง post ใหม่ (admin only)
- `GET /api/posts/[slug]` - ดึง post เดียว
- `PUT /api/posts/[slug]` - แก้ไข post (admin only)
- `DELETE /api/posts/[slug]` - ลบ post (admin only)

## Database Schema

### Comments Table
```sql
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table
```sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Troubleshooting

### ปัญหา: "Unauthorized" เมื่อพยายามเข้า /auth/blog
- ตรวจสอบว่า `ADMIN_GITHUB_USERNAME` ใน `.env` ตรงกับ GitHub username ของคุณ
- ลอง sign out และ sign in ใหม่

### ปัญหา: GitHub OAuth ไม่ทำงาน
- ตรวจสอบว่า `GITHUB_CLIENT_ID` และ `GITHUB_CLIENT_SECRET` ถูกต้อง
- ตรวจสอบว่า callback URL ใน GitHub OAuth App ตรงกับ URL ที่ใช้จริง
- ตรวจสอบว่ามี `AUTH_SECRET` ที่ถูกต้อง

### ปัญหา: ไม่สามารถสร้าง post ได้
- ตรวจสอบว่า slug ไม่ซ้ำกับ post อื่นที่มีอยู่แล้ว
- ตรวจสอบว่ากรอกข้อมูลครบทุกฟิลด์

## Production Deployment

เมื่อ deploy ขึ้น production:

1. อัพเดท callback URL ใน GitHub OAuth App เป็น production URL
2. ตั้งค่า environment variables ใน hosting platform
3. ตรวจสอบว่า `SITE` และ `BASE_PATH` ถูกต้อง
4. Build project: `npm run build`
5. Deploy ตาม platform ที่เลือกใช้

## Security Notes

⚠️ **สำคัญ:**
- อย่า commit ไฟล์ `.env` ขึ้น git
- เก็บ `GITHUB_CLIENT_SECRET` และ `AUTH_SECRET` ไว้เป็นความลับ
- อัพเดท dependencies เป็นประจำเพื่อความปลอดภัย

## License

ใช้ตามอิสระ ไม่มีการรับประกัน
