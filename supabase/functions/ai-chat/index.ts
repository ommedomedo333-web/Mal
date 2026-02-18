import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")!;

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
        const { message, history, language, products } = await req.json();

        if (!message) throw new Error("Message is required");

        const systemPrompt = `
      You are "Elatyab Smart Assistant" (مساعد الأطيب الذكي), a helpful and friendly AI for an Egyptian grocery store specializing in fresh fruits, vegetables, dates, and nuts.
      
      User's preferred language: ${language === 'ar' ? 'Arabic' : 'English'}.
      
      Store Context:
      - We sell high-quality, fresh produce.
      - We have products like: ${products?.map((p: any) => p.name_ar).join(', ') || 'Various fresh produce'}.
      
      Guidelines:
      1. Always reply in ${language === 'ar' ? 'Arabic (Egyptian style preferred if appropriate)' : 'English'}.
      2. Be polite, encouraging healthy eating.
      3. If asked about a product price, mention the price if available in the context.
      4. If asked about health benefits, give brief, scientifically accurate info.
      5. Don't mention competitors.
      
      Current Message: ${message}
      
      Chat History Summary (if any):
      ${history?.map((h: any) => `${h.role}: ${h.content}`).join('\n')}
    `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    maxOutputTokens: 500,
                    temperature: 0.7,
                }
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || "Gemini API Error");
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أستطع فهم ذلك.";

        return new Response(JSON.stringify({ reply }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 200
        });
    } catch (err: any) {
        console.error("AI Assistant Error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            status: 400
        });
    }
});
