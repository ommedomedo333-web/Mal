# 🧪 How to Test Your Email Notifications

Success! Your email system is fully configured. Now let's test it.

## 🔄 Step 1: Restart Server
Since we updated the `.env` file, you **MUST** restart the development server for the changes to take effect.

1. Go to your terminal running `npm run dev`.
2. Press `Ctrl + C` to stop it.
3. Run `npm run dev` again.

## 🛒 Step 2: Place a Test Order

1. Go to your website (e.g., http://localhost:5173).
2. Add a product to your cart.
3. Proceed to checkout.
4. Fill in the delivery details.
5. Click **"Place Order"**.

## 📧 Step 3: Check Admin Email

1. Open the inbox for **`omm651571@gmail.com`**.
2. You should see a new email with the subject: **"🛒 طلب جديد #ORD-..."**.
3. Open it and check:
   - Does it show the correct products?
   - Is the total amount correct?
   - **Click the "إدارة الطلب" button** - it should take you to your admin panel.

## 🐛 Troubleshooting

If you don't see the email:
- Check your **Spam/Junk** folder.
- Open the browser console (F12) while placing the order. Look for any red errors.
- If you see `EmailJS not configured`, it means the server wasn't restarted properly.

---
**Configuration Status:**
- Service ID: ✅ Configured (`service_q4dgxvp`)
- Template ID: ✅ Configured (`template_bo8m5n8`)
- Public Key: ✅ Configured (`kLaVeP3mux-W98hEd`)
