import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const PAYMOB_SECRET_KEY = Deno.env.get("PAYMOB_SECRET_KEY")!;
const PAYMOB_PUBLIC_KEY = Deno.env.get("PAYMOB_PUBLIC_KEY")!;

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
                "Access-Control-Allow-Methods": "POST, OPTIONS"
            }
        });
    }

    try {
        const { amount, orderId, customerData } = await req.json();

        if (!amount) {
            throw new Error("Amount is required");
        }

        const response = await fetch('https://accept.paymob.com/api/intention/v1/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${PAYMOB_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: Math.round(amount * 100),
                currency: 'EGP',
                payment_methods: ['card', 'wallet', 'fawry'],
                items: [
                    {
                        name: `Order #${orderId || 'General'}`,
                        amount: Math.round(amount * 100),
                        description: "Fresh Market Order",
                        quantity: 1
                    }
                ],
                billing_data: {
                    first_name: customerData?.full_name?.split(' ')[0] || "Guest",
                    last_name: customerData?.full_name?.split(' ')[1] || "User",
                    email: customerData?.email || "guest@elatyab.com",
                    phone_number: customerData?.phone_number || "01000000000",
                    apartment: "NA",
                    floor: "NA",
                    street: "NA",
                    building: "NA",
                    shipping_method: "PKG",
                    postal_code: "NA",
                    city: "Cairo",
                    country: "EG",
                    state: "Cairo"
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || JSON.stringify(data));
        }

        const checkoutUrl = `https://accept.paymob.com/api/intention/v1/${data.id}/checkout?public_key=${PAYMOB_PUBLIC_KEY}`;

        return new Response(JSON.stringify({
            success: true,
            checkoutUrl,
            intentId: data.id
        }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 200
        });
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 400
        });
    }
});
