# 📧 Email Notification Setup Guide

## Overview
This system automatically sends email notifications to the admin (`omm651571@gmail.com`) whenever a customer places an order. The email includes:
- Order number and status
- Customer details (name, phone, address)
- Complete list of ordered products
- Total amount
- Direct link to admin panel for order management

## Setup Instructions

### Option 1: EmailJS (Recommended - Free & Easy)

EmailJS is a free service that allows you to send emails directly from JavaScript without a backend server.

#### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

#### Step 2: Add Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (recommended)
4. Click **Connect Account** and authorize with your Gmail account (`omm651571@gmail.com`)
5. Copy the **Service ID** (e.g., `service_abc123`)

#### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Set the template name: `Order Notification`
4. Configure the template:

**To Email:**
```
{{to_email}}
```

**From Name:**
```
الأطيب - Elatyab Market
```

**Subject:**
```
{{subject}}
```

**Content (HTML):**
```html
{{{message_html}}}
```

**Content (Plain Text):**
```
{{{message}}}
```

5. Click **Save**
6. Copy the **Template ID** (e.g., `template_xyz789`)

#### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** (e.g., `abc123xyz789`)

#### Step 5: Add to .env File
Add these lines to your `.env` file:

```env
# EmailJS Configuration for Order Notifications
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123xyz789
```

Replace the values with your actual EmailJS credentials.

#### Step 6: Test the System
1. Restart your development server: `npm run dev`
2. Place a test order through your website
3. Check `omm651571@gmail.com` for the notification email
4. Verify the email contains all order details and the admin panel link

---

### Option 2: Resend (Alternative - More Professional)

Resend is another free email service with a generous free tier.

#### Step 1: Create Resend Account
1. Go to [https://resend.com/](https://resend.com/)
2. Sign up for a free account
3. Verify your email

#### Step 2: Get API Key
1. Go to **API Keys** in the dashboard
2. Click **Create API Key**
3. Name it "Order Notifications"
4. Copy the API key

#### Step 3: Verify Domain (Optional)
For production, you should verify your domain. For testing, you can use Resend's test domain.

#### Step 4: Update Email Service
Create a new file `src/services/emailServiceResend.js`:

```javascript
const ADMIN_EMAIL = 'omm651571@gmail.com';
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export const sendOrderNotificationToAdmin = async (orderData, items) => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'Elatyab Market <orders@yourdomain.com>',
      to: [ADMIN_EMAIL],
      subject: `🛒 طلب جديد #${orderData.order_number}`,
      html: '...' // Use the HTML template from emailService.js
    })
  });

  return response.ok ? { success: true } : { success: false };
};
```

---

### Option 3: Supabase Edge Function (Advanced)

For a more robust solution, you can create a Supabase Edge Function.

#### Step 1: Install Supabase CLI
```bash
npm install -g supabase
```

#### Step 2: Create Edge Function
```bash
supabase functions new send-order-email
```

#### Step 3: Implement Function
Edit `supabase/functions/send-order-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { orderData, items } = await req.json()
  
  // Send email using Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'orders@yourdomain.com',
      to: 'omm651571@gmail.com',
      subject: `New Order #${orderData.order_number}`,
      html: '...' // Your HTML template
    })
  })

  return new Response(JSON.stringify({ success: res.ok }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

#### Step 4: Deploy Function
```bash
supabase functions deploy send-order-email
```

---

## Email Template Preview

The email sent to admin will look like this:

```
┌─────────────────────────────────────────┐
│   🛒 طلب جديد من الأطيب                │
│   تم استلام طلب جديد من أحد العملاء    │
└─────────────────────────────────────────┘

📋 معلومات الطلب
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
رقم الطلب: ORD-123456
الحالة: قيد الانتظار
طريقة الدفع: المحفظة
التاريخ: 2026-02-16 11:30 AM

👤 معلومات العميل
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
الاسم: أحمد محمد
رقم الهاتف: 01234567890
العنوان: شارع الجامعة، المنصورة

🛍️ المنتجات المطلوبة
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. تفاح أحمر - 2 كيلو × 25 ج.م = 50 ج.م
2. موز - 3 كيلو × 15 ج.م = 45 ج.م
3. برتقال - 1 كيلو × 20 ج.م = 20 ج.م

💰 الإجمالي: 115.00 جنيه مصري

[🎛️ إدارة الطلب من لوحة التحكم]
```

## Testing

### Test Email Sending
1. Place a test order on your website
2. Check the browser console for email sending logs
3. Check `omm651571@gmail.com` inbox
4. Verify all order details are correct
5. Click the admin panel link to ensure it works

### Troubleshooting

**Email not received?**
- Check spam/junk folder
- Verify EmailJS credentials in `.env`
- Check browser console for errors
- Ensure you restarted the dev server after adding env variables

**Email missing details?**
- Check that order data includes customer info
- Verify items array has product details
- Check browser console logs

**Admin panel link not working?**
- Verify the link points to `/admin`
- Ensure admin authentication is set up

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to Git
- Keep your EmailJS/Resend API keys private
- Use environment variables for all sensitive data
- For production, use a custom domain for emails

## Free Tier Limits

**EmailJS Free Plan:**
- 200 emails/month
- Perfect for small businesses
- No credit card required

**Resend Free Plan:**
- 3,000 emails/month
- 100 emails/day
- More suitable for growing businesses

## Next Steps

After setup:
1. ✅ Test with a real order
2. ✅ Verify email formatting
3. ✅ Check admin panel link
4. ✅ Set up email filters/labels in Gmail
5. ✅ Consider upgrading to paid plan if needed

---

**Need Help?**
- EmailJS Docs: https://www.emailjs.com/docs/
- Resend Docs: https://resend.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
