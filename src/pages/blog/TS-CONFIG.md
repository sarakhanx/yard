---
layout: ../../layouts/BlogPost.astro
title: astro-ts-config
date: 2025-01-19
author: Sarawut Khantiyoo
description: การเพิ่มการตั้งค่าของ TS-Config AstroJS
slug: https://cms.givendata.com/media/lzwngr4a/why-we-migrated-from-next-to-astro-og.jpg?width=1200&height=630
---
```ts
{
  "extends": "astro/tsconfigs/base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
    "@/*": [
        "./src/*"
      ]
    },
    "jsx": "preserve",
    "jsxImportSource": "preact",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowJs": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.astro"],
  "exclude": ["node_modules", "dist"]
}
```

### สาเหตุที่ต้องมีก็เพราะว่า Astro ไม่ได้ Provided ให้น่ะ
- **`compilerOptions`:**
    
    - **`strict`**: เปิดใช้งานโหมด strict type-checking เพื่อให้โค้ดมีความปลอดภัยและลดข้อผิดพลาด.
    - **`baseUrl`**: ตั้งค่า `.` เพื่อให้ paths ทำงานง่ายขึ้น.
    - **`paths`**: กำหนด alias เพื่อใช้งาน path ที่เข้าใจง่าย เช่น:
        - `@components/*` ชี้ไปที่ `src/components/*`
        - `@layouts/*` ชี้ไปที่ `src/layouts/*`
    - **`jsx`** และ **`jsxImportSource`**: ใช้ `preserve` เพื่อรองรับ JSX syntax (เช่น Preact).
    - **`moduleResolution`**: ใช้ `node` เพื่อให้ตรงกับรูปแบบการ resolve module ที่ใช้งานทั่วไป.
    - **`esModuleInterop`**: เปิดให้ใช้งาน CommonJS และ ESModule ได้ร่วมกัน.
    - **`resolveJsonModule`**: ให้ TypeScript รองรับการ import ไฟล์ JSON ได้โดยตรง.
    - **`isolatedModules`**: เพิ่มความเข้ากันได้เมื่อใช้งาน TypeScript กับโมดูลแบบแยกกัน.
    - **`allowJs`**: อนุญาตให้ใช้ไฟล์ `.js` ร่วมกับ TypeScript.
    - **`skipLibCheck`**: ข้ามการตรวจสอบ `.d.ts` ในไลบรารีเพื่อเพิ่มความเร็วในการคอมไพล์.
- **`include`:**
    
    - ระบุว่า TypeScript จะทำงานเฉพาะในไฟล์ `src/**/*.ts`, `src/**/*.tsx`, และ `src/**/*.astro`.
	สร้าง `end.d.ts` เพื่อสร้าง env ให้ ts.config ไม่ error
```copy
/// <reference types="astro/client" />
```
- **`exclude`:**
    
    - ยกเว้นโฟลเดอร์ `node_modules` และ `dist` จากการตรวจสอบ TypeScript.

### ASTRO SHADCN [ที่นี่](https://ui.shadcn.com/docs/installation/astro#configure-your-astro-project)
