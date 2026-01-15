# نشر المشروع على Cloudflare Pages

## الخطوات المطلوبة:

### 1. رفع الكود إلى GitHub
الكود موجود بالفعل في المستودع: `anasabukharma/twtheeq-manus-front`

### 2. إنشاء مشروع على Cloudflare Pages

1. اذهب إلى: https://dash.cloudflare.com/
2. اختر **Pages** من القائمة الجانبية
3. اضغط على **Create a project**
4. اختر **Connect to Git**
5. اختر **GitHub** وقم بتوصيل حسابك
6. اختر المستودع: `anasabukharma/twtheeq-manus-front`

### 3. إعدادات البناء (Build Settings)

```
Build command: pnpm run build
Build output directory: dist
Root directory: /
Node version: 22
```

### 4. متغيرات البيئة (Environment Variables)
لا توجد متغيرات بيئة مطلوبة حالياً.

### 5. النشر
اضغط على **Save and Deploy**

---

## الرابط الدائم
بعد النشر، ستحصل على رابط دائم مثل:
```
https://twtheeq-nas-frontend.pages.dev
```

يمكنك أيضاً ربط نطاق مخصص (Custom Domain) من إعدادات المشروع.

---

## ملاحظات مهمة

1. **التحديثات التلقائية**: أي تغيير يتم رفعه إلى GitHub سيتم نشره تلقائياً
2. **Preview Deployments**: كل branch سيحصل على رابط معاينة خاص
3. **Rollback**: يمكنك الرجوع لأي نسخة سابقة من لوحة التحكم
4. **SSL/HTTPS**: يتم تفعيله تلقائياً
5. **CDN**: يتم توزيع الموقع عبر شبكة Cloudflare العالمية

---

## بديل: النشر المباشر (Direct Upload)

إذا كنت تفضل النشر المباشر دون GitHub:

```bash
# تثبيت Wrangler
npm install -g wrangler

# تسجيل الدخول
wrangler login

# النشر
wrangler pages deploy dist --project-name=twtheeq-nas-frontend
```

---

**تاريخ الإنشاء:** 15 يناير 2026
