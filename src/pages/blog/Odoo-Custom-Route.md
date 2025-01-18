---
layout: ../../layouts/BlogPost.astro
title: Route-custom
date: 2025-01-20
author: Sarawut Khantiyoo
description: เมื่อสินค้าถูกขายหรือย้ายไปตามขั้นตอนที่เรากำหนด การสร้าง Custom Route จึงเปรียบเสมือนการกำหนดกระบวนการเฉพาะสำหรับสินค้านั้น ๆ เพื่อให้ระบบทำงานตามลำดับที่ต้องการ
slug: https://www.guru.com/blog/wp-content/uploads/2022/11/what-is-an-odoo-developer-770x515.jpg
---
# การตั้งค่า Route ใน Odoo 17 Community

## Route คืออะไร?

ใน Odoo 17 Community ซึ่งเป็นเวอร์ชันที่ผมเลือกใช้ เราสามารถกำหนดให้สินค้าผ่าน `เส้นทาง` หรือ `Route` ซึ่งทำหน้าที่เปรียบเสมือน Logic ในการเคลื่อนย้ายสินค้าภายในระบบ เมื่อสินค้าถูกขายหรือย้ายไปตามขั้นตอนที่เรากำหนด การสร้าง Custom Route จึงเปรียบเสมือนการกำหนดกระบวนการเฉพาะสำหรับสินค้านั้น ๆ เพื่อให้ระบบทำงานตามลำดับที่ต้องการ

---

## การตั้งค่า Multi-Step Routes

### 1. เปิดใช้งาน Multi-Step Routes

ในการตั้งค่า Route เพื่อรองรับการขายสินค้าพร้อมการประกอบในเมนู `Manufacture` ก่อนส่งกลับไปยังคลังสินค้าเพื่อดำเนินการแพ็คสินค้า เราต้องเริ่มจากการตั้งค่าให้บริษัทสามารถใช้งาน Multi-Step Routes ได้โดย:

1. ไปที่ `Settings > Inventory`
    
2. ในส่วนของ `Warehouse` ให้เปิดใช้งาน `Multi-Step Routes`
    
3. ตั้งค่า `Warehouse Route` ตามความต้องการ
    

จากนั้นไปที่การตั้งค่าของ `Warehouse` (คลังสินค้าหลักของบริษัท) และกำหนดค่า `Outgoing Shipments` เป็น `Send goods in output and then deliver (2 steps)` เพื่อให้ระบบสามารถคัดแยกและจัดส่งสินค้าได้อย่างเป็นระบบ

---

### 2. การสร้าง Warehouse สำหรับการประกอบสินค้า

เนื่องจากเราต้องการให้สินค้าผ่านกระบวนการประกอบก่อนการจัดส่ง เราจึงต้องสร้างคลังสินค้าใหม่สำหรับการประกอบสินค้า โดยกำหนดค่าดังนี้:

1. ตั้งชื่อ Warehouse เป็น `โกดังประกอบ` และกำหนด Short Name เช่น `ASSEM`
    
2. กำหนดค่า `Shipments` เป็น `1 Step` สำหรับทุกกระบวนการ
    
3. ในส่วนของ `Resupply` ให้เลือก `1 Step` และเปิดใช้งาน `Resupply From` บริษัทหลัก เพื่อให้สามารถดึงสินค้าเข้ามาในกรณีที่จำเป็น
    

เมื่อสร้างเสร็จสิ้น ระบบจะสร้าง `Location` อัตโนมัติในรูปแบบ `Warehouse Short Name>/Stock` เช่น หากตั้ง Short Name เป็น `ASSEM` จะได้ Location เป็น `ASSEM/Stock`

---

### 3. การสร้าง Operation Type

`Operation Type` เป็นประเภทของการดำเนินการที่ใช้ติดตามการเคลื่อนย้ายสินค้า โดยต้องสร้างตามลำดับดังนี้:

#### 3.1 Operation สำหรับการประกอบสินค้า (`ประกอบ→แพ็ค`)

- **Type of Operation**: `Manufacturing`
    
- **Reference Sequence**: `ใบประกอบ-%(y)s%(month)s-<Sequence Size=5>`
    
- **Sequence Prefix**: `ใบประกอบ`
    
- **Reservation Method**: `At Confirmation`
    
- **Consume Reserved Lots/Serial Numbers automatically**: `True`
    
- **Default Source Location**: `WH/Stock`
    
- **Default Destination Location**: `ASSEM/Stock`
    

#### 3.2 Operation สำหรับการเตรียมสินค้า (`เตรียม→แพ็ค`)

- **Type of Operation**: `Internal Transfer`
    
- **Reference Sequence**: `ใบเตรียม-%(y)s%(month)s-<Sequence Size=5>`
    
- **Sequence Prefix**: `ใบแพ็ค`
    
- **Warehouse**: `บริษัทหลักของเรา`
    
- **Reservation Method**: `At Confirmation`
    
- **Create New**: `True`
    
- **Default Source Location**: `WH/Stock`
    
- **Default Destination Location**: `ASSEM/Stock`
    

#### 3.3 Operation สำหรับการแพ็คสินค้า (`แพ็ค→เตรียมส่ง`)

- **Type of Operation**: `Internal Transfer`
    
- **Reference Sequence**: `ใบแพ็ค-%(y)s%(month)s-<Sequence Size=5>`
    
- **Sequence Prefix**: `ใบแพ็ค`
    
- **Warehouse**: `บริษัทหลักของเรา`
    
- **Reservation Method**: `At Confirmation`
    
- **Create New**: `True`
    
- **Default Source Location**: `ASSEM/Stock`
    
- **Default Destination Location**: `WH/Output`
    

#### 3.4 Operation สำหรับการขนส่งถึงลูกค้า (`ขนส่ง→ลูกค้า`)

- **Type of Operation**: `Delivery`
    
- **Reference Sequence**: `DLN-%(y)s%(month)s-<Sequence Size=5>`
    
- **Sequence Prefix**: `DLN`
    
- **Warehouse**: `บริษัทหลักของเรา`
    
- **Reservation Method**: `At Confirmation`
    
- **Use Existing ones**: `True`
    
- **Default Source Location**: `WH/Output`
    
- **Default Destination Location**: `Partners/Customers`
    

---

## การสร้าง Route

เมื่อตั้งค่า Operation Type เรียบร้อยแล้ว เราสามารถสร้าง Route ได้โดย:

1. ไปที่ `/Configurations/Route` และสร้าง Route ใหม่
    
2. ตั้งชื่อ Route เป็น `ขนส่งเอกชน` และเลือก `Company` เป็น `บริษัทหลักของเรา`
    
3. ในส่วนของ `Applicable On` ให้เลือก `Sales Order Lines`
    
4. กำหนด Rules ตามลำดับดังนี้:
    
    - `ประกอบ→แพ็ค` (Action: `Manufacture`, Supply Method: `Take from stock`)
        
    - `เตรียม→แพ็ค` (Action: `Pull From`, Supply Method: `Take from stock, if unavailable, Trigger another rule`)
        
    - `แพ็ค→เตรียมส่ง` (Action: `Pull From`, Supply Method: `Trigger another rule`)
        
    - `ขนส่ง→ลูกค้า` (Action: `Pull From`, Supply Method: `Trigger another rule`)
        

หลังจากสร้าง Route เรียบร้อย ให้ทำการทดสอบโดยการขายสินค้า เช่น `Shelf` ตามกระบวนการที่กำหนด หากทุกอย่างถูกต้อง ระบบจะสร้างเอกสารอัตโนมัติ 4 ใบในกรณีที่มีการประกอบ และ 3 ใบหากเป็นการแพ็คสินค้าเท่านั้น

---

## จุดที่ต้องระวัง (Tricky Part)

- ค่าของ `Route` สำหรับ `Manufacture` ต้องมีการแก้ไข Prefix ให้ตรงกับ Operation ที่เราสร้างขึ้น เพื่อให้เอกสารที่เกิดขึ้นในระบบถูกต้องตามที่กำหนด
    

---

## สรุป

การตั้งค่า Route ใน Odoo 17 Community ช่วยให้สามารถกำหนดกระบวนการเคลื่อนย้ายสินค้าตามลำดับที่ต้องการ โดยการสร้าง Multi-Step Routes, Warehouse, Operation Type และการกำหนด Route ที่เหมาะสมกับกระบวนการขายของบริษัท เมื่อกำหนดค่าเสร็จสิ้น ระบบจะสามารถดำเนินการตามลำดับที่กำหนดและช่วยให้การจัดการสินค้ามีความเป็นระบบมากยิ่งขึ้น