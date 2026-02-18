// السطر 1 - المرسِل يفضل resend.dev
from: "الأطيب <onboarding@resend.dev>",

// السطر 2 - المستقبِل هو Gmail بتاعك
to: ["omm651571@gmail.com"],
const ADMIN_EMAIL = 'omm651571@gmail.com';
const ADMIN_PANEL_URL = "https://atyab.netlify.app/admin";
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { orderData, items } = await req.json();

        if (!orderData || !items) {
            throw new Error('Missing order data or items');
        }

        // Format order items for email
        const itemsList = items.map((item: any, index: number) => {
            const productName = item.products?.name_ar || item.name_ar || 'منتج';
            const quantity = item.quantity || 1;
            const price = item.products?.price || item.price || 0;
            const subtotal = price * quantity;

            return `${index + 1}. ${productName} - الكمية: ${quantity} ${item.products?.unit || 'كيلو'} - السعر: ${price} ج.م - الإجمالي: ${subtotal} ج.م`;
        }).join('\n');

        const totalAmount = orderData.total_amount || items.reduce((sum: number, item: any) => {
            const price = item.products?.price || item.price || 0;
            const quantity = item.quantity || 1;
            return sum + (price * quantity);
        }, 0);

        // Create email HTML content
        const emailHTML = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>طلب جديد - ${orderData.order_number}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; direction: rtl; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #2d8a4e 0%, #1a5c32 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
    .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
    .content { padding: 30px; }
    .order-info { background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
    .order-info h2 { margin: 0 0 15px 0; color: #2d8a4e; font-size: 20px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-weight: bold; color: #555; }
    .info-value { color: #333; }
    .items-section { margin-top: 25px; }
    .items-section h3 { color: #2d8a4e; font-size: 18px; margin-bottom: 15px; }
    .item { background-color: #f8f9fa; padding: 15px; margin-bottom: 10px; border-radius: 6px; border-right: 4px solid #2d8a4e; }
    .total { background-color: #2d8a4e; color: white; padding: 20px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0; }
    .button { display: inline-block; background-color: #ff9a00; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; text-align: center; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
    .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; }
    .status-pending { background-color: #fff3cd; color: #856404; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛒 طلب جديد من الأطيب</h1>
      <p>تم استلام طلب جديد من أحد العملاء</p>
    </div>
    
    <div class="content">
      <div class="order-info">
        <h2>📋 معلومات الطلب</h2>
        <div class="info-row">
          <span class="info-label">رقم الطلب:</span>
          <span class="info-value"><strong>${orderData.order_number}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">الحالة:</span>
          <span class="info-value"><span class="status-badge status-pending">قيد الانتظار</span></span>
        </div>
        <div class="info-row">
          <span class="info-label">طريقة الدفع:</span>
          <span class="info-value">${orderData.payment_method === 'wallet' ? 'المحفظة' : orderData.payment_method === 'cash' ? 'نقداً' : 'بطاقة'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">التاريخ:</span>
          <span class="info-value">${new Date().toLocaleString('ar-EG')}</span>
        </div>
      </div>

      <div class="order-info">
        <h2>👤 معلومات العميل</h2>
        <div class="info-row">
          <span class="info-label">الاسم:</span>
          <span class="info-value">${orderData.customer_name || 'غير محدد'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">رقم الهاتف:</span>
          <span class="info-value">${orderData.phone_number || 'غير محدد'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">العنوان:</span>
          <span class="info-value">${orderData.delivery_address?.address || 'غير محدد'}</span>
        </div>
      </div>

      <div class="items-section">
        <h3>🛍️ المنتجات المطلوبة</h3>
        ${items.map((item: any, index: number) => {
            const productName = item.products?.name_ar || item.name_ar || 'منتج';
            const quantity = item.quantity || 1;
            const price = item.products?.price || item.price || 0;
            const unit = item.products?.unit || 'كيلو';
            const subtotal = price * quantity;

            return `
          <div class="item">
            <strong>${index + 1}. ${productName}</strong><br>
            الكمية: ${quantity} ${unit} × ${price} ج.م = <strong>${subtotal.toFixed(2)} ج.م</strong>
          </div>
          `;
        }).join('')}
      </div>

      <div class="total">
        💰 الإجمالي: ${totalAmount.toFixed(2)} جنيه مصري
      </div>

      <div style="text-align: center;">
        <a href="${ADMIN_PANEL_URL}" class="button">
          🎛️ إدارة الطلب من لوحة التحكم
        </a>
      </div>
    </div>

    <div class="footer">
      <p>هذا البريد الإلكتروني تم إرساله تلقائياً من نظام الأطيب</p>
      <p>للوصول إلى لوحة التحكم: <a href="${ADMIN_PANEL_URL}">${ADMIN_PANEL_URL}</a></p>
    </div>
  </div>
</body>
</html>
    `;

        // Send email using Resend
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: 'Elatyab Market <orders@resend.dev>', // You should update this to your verified domain
                to: [ADMIN_EMAIL],
                subject: `🛒 طلب جديد #${orderData.order_number} - الأطيب`,
                html: emailHTML,
            })
        })

        const result = await res.json()

        return new Response(JSON.stringify(result), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
