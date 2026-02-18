import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Gmail SMTP via Gmail API using OAuth2 (App Password approach via nodemailer alternative)
// We use Resend as the transport — just change the TO address to the admin gmail

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const ADMIN_EMAIL = "omm651571@gmail.com"; // 👑 Admin Gmail — hardcoded, never changes
const ADMIN_PANEL_URL = "https://elatyab.netlify.app/admin"; // ✏️ غير هذا لرابط الأدمن بتاعتك

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const body = await req.json();
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      items,
      total,
      deliveryFee,
      grandTotal,
      deliveryAddress,
      paymentMethod,
      orderDate,
      notes,
    } = body;

    if (!orderId || !items || !grandTotal) {
      throw new Error("Missing required order fields: orderId, items, grandTotal");
    }

    // ── Build items table rows ──────────────────────────────────────────────
    const itemsRows = (items || [])
      .map(
        (item: any) => `
        <tr>
          <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0; font-size:14px; color:#1a1a1a;">
            ${item.name_ar || item.name || "منتج"}
          </td>
          <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0; font-size:14px; text-align:center; color:#555;">
            ${item.qty || item.quantity || 1}
          </td>
          <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0; font-size:14px; text-align:center; color:#555;">
            ${item.unit || "وحدة"}
          </td>
          <td style="padding:12px 16px; border-bottom:1px solid #f0f0f0; font-size:14px; text-align:left; font-weight:700; color:#003e31;">
            ${((item.price || 0) * (item.qty || item.quantity || 1)).toFixed(2)} ج.م
          </td>
        </tr>
      `
      )
      .join("");

    const paymentLabels: Record<string, string> = {
      cash: "💵 كاش عند الاستلام",
      wallet: "📱 فودافون كاش / محفظة إلكترونية",
      card: "💳 بطاقة بنكية",
      fawry: "🏪 فوري",
    };
    const paymentLabel = paymentLabels[paymentMethod] || paymentMethod || "غير محدد";
    const orderDateFormatted =
      orderDate ||
      new Date().toLocaleString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

    // ── ADMIN EMAIL HTML ────────────────────────────────────────────────────
    const adminHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0; padding:0; background:#f4f6f8; font-family:'Segoe UI', Arial, sans-serif; direction:rtl;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8; padding:30px 0;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#003e31 0%,#005a47 100%); padding:32px 40px; text-align:center;">
              <div style="font-size:36px; margin-bottom:8px;">🛒</div>
              <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:800; letter-spacing:-0.5px;">
                طلب جديد وارد!
              </h1>
              <p style="color:rgba(255,255,255,0.75); margin:8px 0 0; font-size:14px;">
                تم استلام طلب جديد بتاريخ ${orderDateFormatted}
              </p>
            </td>
          </tr>

          <!-- ORDER ID BANNER -->
          <tr>
            <td style="background:#db6a28; padding:14px 40px; text-align:center;">
              <span style="color:#fff; font-size:18px; font-weight:900; letter-spacing:1px;">
                رقم الطلب: #${orderId}
              </span>
            </td>
          </tr>

          <!-- CUSTOMER INFO -->
          <tr>
            <td style="padding:32px 40px 0;">
              <h2 style="color:#003e31; font-size:16px; font-weight:700; margin:0 0 16px; border-right:4px solid #db6a28; padding-right:12px;">
                بيانات العميل
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-bottom:12px;">
                    <span style="font-size:12px; color:#999; display:block; margin-bottom:3px;">الاسم</span>
                    <span style="font-size:15px; color:#1a1a1a; font-weight:600;">${customerName || "غير محدد"}</span>
                  </td>
                  <td width="50%" style="padding-bottom:12px;">
                    <span style="font-size:12px; color:#999; display:block; margin-bottom:3px;">رقم الهاتف</span>
                    <span style="font-size:15px; color:#1a1a1a; font-weight:600; direction:ltr; unicode-bidi:embed;">
                      ${customerPhone || "غير محدد"}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding-bottom:12px;">
                    <span style="font-size:12px; color:#999; display:block; margin-bottom:3px;">البريد الإلكتروني</span>
                    <span style="font-size:15px; color:#1a1a1a; font-weight:600;">${customerEmail || "غير محدد"}</span>
                  </td>
                  <td width="50%" style="padding-bottom:12px;">
                    <span style="font-size:12px; color:#999; display:block; margin-bottom:3px;">طريقة الدفع</span>
                    <span style="font-size:15px; color:#1a1a1a; font-weight:600;">${paymentLabel}</span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-bottom:12px;">
                    <span style="font-size:12px; color:#999; display:block; margin-bottom:3px;">عنوان التوصيل</span>
                    <span style="font-size:15px; color:#1a1a1a; font-weight:600;">${deliveryAddress || "لم يحدد عنوان"}</span>
                  </td>
                </tr>
                ${notes ? `
                <tr>
                  <td colspan="2" style="padding-bottom:12px;">
                    <span style="font-size:12px; color:#999; display:block; margin-bottom:3px;">ملاحظات العميل</span>
                    <span style="font-size:15px; color:#db6a28; font-weight:600;">${notes}</span>
                  </td>
                </tr>` : ""}
              </table>
            </td>
          </tr>

          <!-- ITEMS TABLE -->
          <tr>
            <td style="padding:24px 40px 0;">
              <h2 style="color:#003e31; font-size:16px; font-weight:700; margin:0 0 16px; border-right:4px solid #db6a28; padding-right:12px;">
                المنتجات المطلوبة
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0f0f0; border-radius:10px; overflow:hidden;">
                <thead>
                  <tr style="background:#f8f9fa;">
                    <th style="padding:12px 16px; text-align:right; font-size:12px; color:#666; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">المنتج</th>
                    <th style="padding:12px 16px; text-align:center; font-size:12px; color:#666; font-weight:700;">الكمية</th>
                    <th style="padding:12px 16px; text-align:center; font-size:12px; color:#666; font-weight:700;">الوحدة</th>
                    <th style="padding:12px 16px; text-align:left; font-size:12px; color:#666; font-weight:700;">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- ORDER TOTAL -->
          <tr>
            <td style="padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa; border-radius:12px; padding:20px; display:block;">
                <tr>
                  <td style="padding:6px 0;">
                    <span style="font-size:14px; color:#666;">المجموع الفرعي</span>
                  </td>
                  <td style="padding:6px 0; text-align:left;">
                    <span style="font-size:14px; color:#1a1a1a; font-weight:600;">${(total || 0).toFixed(2)} ج.م</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:6px 0;">
                    <span style="font-size:14px; color:#666;">رسوم التوصيل</span>
                  </td>
                  <td style="padding:6px 0; text-align:left;">
                    <span style="font-size:14px; color:#1a1a1a; font-weight:600;">${(deliveryFee || 5).toFixed(2)} ج.م</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0 0; border-top:2px solid #e0e0e0;">
                    <span style="font-size:18px; color:#003e31; font-weight:800;">الإجمالي الكلي</span>
                  </td>
                  <td style="padding:12px 0 0; border-top:2px solid #e0e0e0; text-align:left;">
                    <span style="font-size:22px; color:#db6a28; font-weight:900;">${(grandTotal || 0).toFixed(2)} ج.م</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ADMIN PANEL BUTTON -->
          <tr>
            <td style="padding:0 40px 40px; text-align:center;">
              <a href="${ADMIN_PANEL_URL}"
                style="display:inline-block; background:linear-gradient(135deg,#003e31,#005a47); color:#ffffff; padding:16px 40px; border-radius:12px; text-decoration:none; font-size:16px; font-weight:800; letter-spacing:0.3px; box-shadow:0 4px 16px rgba(0,62,49,0.3);">
                🖥️ فتح لوحة التحكم للرد على الطلب
              </a>
              <p style="font-size:12px; color:#aaa; margin:12px 0 0;">
                هذا الإيميل مرسل تلقائياً لـ ${ADMIN_EMAIL} فقط
              </p>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f8f9fa; padding:20px 40px; text-align:center; border-top:1px solid #f0f0f0;">
              <p style="font-size:12px; color:#bbb; margin:0;">
                © ${new Date().getFullYear()} الأطيب — نظام إدارة الطلبات الآلي
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
    `;

    // ── Send via Resend to ADMIN only ───────────────────────────────────────
    const resendPayload = {
      from: "الأطيب - إشعار طلب <onboarding@resend.dev>",
      to: [ADMIN_EMAIL], // 👑 Admin email ONLY
      subject: `🛒 طلب جديد #${orderId} — ${customerName || "عميل"} — ${(grandTotal || 0).toFixed(2)} ج.م`,
      html: adminHtml,
      reply_to: customerEmail || undefined,
    };

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(resendPayload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || JSON.stringify(data));
    }

    console.log(`✅ Order email sent to admin for order #${orderId}`);

    return new Response(
      JSON.stringify({ success: true, emailId: data.id, sentTo: ADMIN_EMAIL }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        status: 200,
      }
    );
  } catch (err: any) {
    console.error("❌ Order email error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }
});
