"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Brain, Send, Bot, User, ShoppingBasket, RefreshCw } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { useAuthContext } from '../src/supabase/context-providers';
import { walletService } from '../src/supabase/supabase-service';
import { supabase } from '../src/supabase/supabase-config';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name_ar: string;
  name_en?: string | null;
  price: number;
  original_price?: number | null;
  discount_percentage?: number | null;
  unit?: string | null;
  rating?: number | null;
  total_reviews?: number | null;
  category_id?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  stock_quantity?: number | null;
  image_url?: string | null;
  is_active?: boolean | null;
}

const AIAssistant: React.FC = () => {
  const { language, t } = useAppContext();
  const { user } = useAuthContext();
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    {
      role: 'ai',
      content: language === 'ar'
        ? 'مرحباً! أنا مساعدك الذكي في الأطيب 🌿\n\nيمكنني مساعدتك في:\n• معرفة أسعار وتوافر المنتجات\n• الفوائد الصحية للفواكه والخضروات\n• نصائح الطازجية والتخزين\n• مقارنة بين المنتجات\n\nاسألني أي سؤال!'
        : 'Hello! I am your Elatyab AI assistant 🌿\n\nI can help you with:\n• Product prices & availability\n• Health benefits of fruits & vegetables\n• Freshness & storage tips\n• Product comparisons\n\nAsk me anything!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data, error } = await (supabase
        .from('products')
        .select(`
          id,
          name_ar,
          name_en,
          price,
          original_price,
          discount_percentage,
          unit,
          rating,
          total_reviews,
          category_id,
          description_ar,
          description_en,
          stock_quantity,
          image_url,
          is_active
        `)
        .eq('is_active', true)
        .order('name_ar', { ascending: true }) as any);

      if (error) throw error;

      setProducts(data || []);
      setProductsLoaded(true);
      console.log(`✅ Loaded ${data?.length || 0} products from Supabase`);
    } catch (error: any) {
      console.error('❌ Error loading products:', error.message);
      setProductsLoaded(false);
    } finally {
      setLoadingProducts(false);
    }
  };

  const buildProductsContext = (): string => {
    if (products.length === 0) return '';

    const productsList = products.map(p => {
      const name = language === 'ar'
        ? (p.name_ar || p.name_en || 'غير معروف')
        : (p.name_en || p.name_ar || 'Unknown');

      const availability = p.stock_quantity !== undefined && p.stock_quantity !== null
        ? (p.stock_quantity > 0
          ? (language === 'ar' ? `متاح (${p.stock_quantity} وحدة)` : `Available (${p.stock_quantity} units)`)
          : (language === 'ar' ? 'غير متاح' : 'Out of stock'))
        : (language === 'ar' ? 'متاح' : 'Available');

      const priceInfo = p.original_price && p.original_price > p.price
        ? (language === 'ar'
          ? `${p.price} ج.م (كان ${p.original_price} ج.م - خصم ${p.discount_percentage}%)`
          : `${p.price} EGP (was ${p.original_price} EGP - ${p.discount_percentage}% off)`)
        : (language === 'ar' ? `${p.price} ج.م` : `${p.price} EGP`);

      const unit = p.unit
        ? (language === 'ar' ? `| الوحدة: ${p.unit}` : `| Unit: ${p.unit}`)
        : '';

      const rating = p.rating
        ? (language === 'ar'
          ? `| التقييم: ${p.rating}⭐ (${p.total_reviews} تقييم)`
          : `| Rating: ${p.rating}⭐ (${p.total_reviews} reviews)`)
        : '';

      const description = language === 'ar'
        ? (p.description_ar || '')
        : (p.description_en || '');

      return `- ${name} | السعر: ${priceInfo} ${unit} ${rating} | التوافر: ${availability}${description ? ` | الوصف: ${description}` : ''}`;
    }).join('\n');

    return language === 'ar'
      ? `\n\n=== قائمة منتجات متجر الأطيب ===\n${productsList}\n================================`
      : `\n\n=== Elatyab Market Products List ===\n${productsList}\n====================================`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    // Award Points for Interaction (Daily)
    if (user?.id && messages.length === 1) {
      const today = new Date().toDateString();
      const lastReward = localStorage.getItem('ai_reward_last');
      if (lastReward !== today) {
        const rewardPts = Math.round(5 * walletService.PROFIT_MULTIPLIER);
        walletService.addPoints(user.id, rewardPts, 'First daily AI interaction');
        localStorage.setItem('ai_reward_last', today);
        toast.success(language === 'ar'
          ? `ربحت ${rewardPts} نقطة لتفاعلك مع مساعدنا الذكي! 🌿`
          : `Earned ${rewardPts} PTS for using our AI! 🌿`,
          { icon: '🪙', style: { borderRadius: '24px', background: '#003e31', color: '#fff', fontWeight: '900' } }
        );
      }
    }

    try {
      const openRouterKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

      console.log('OpenRouter Key present:', !!openRouterKey);
      console.log('Gemini Key present:', !!geminiKey);

      const productsContext = buildProductsContext();
      const hasProducts = products.length > 0;

      const systemPrompt = `You are a helpful AI assistant for "Elatyab Market" (الأطيب), a premium fresh fruit and vegetable store in Egypt.

Answer in ${language === 'ar' ? 'Arabic' : 'English'}.

Your capabilities:
1. Answer questions about product prices and availability using the products list below
2. Provide health benefits of fruits and vegetables
3. Give freshness and storage tips
4. Compare products when asked
5. Answer general questions about nutrition and healthy eating

Important rules:
- Always be friendly and helpful
- If asked about a product not in the list, say it's not available
- For prices, always mention the currency (جنيه مصري / EGP)
- If a product has a discount, mention the original price and the discounted price
- Mention the unit of measurement when relevant (kg, piece, pack, etc.)
- If a product has reviews, mention the rating when relevant
- Keep answers concise but informative
${hasProducts ? productsContext : (language === 'ar' ? '\n\nملاحظة: لم يتم تحميل قائمة المنتجات حالياً.' : '\n\nNote: Products list is not loaded currently.')}`;

      let aiResponse = '';

      // Try OpenRouter first
      if (openRouterKey && openRouterKey.startsWith('sk-or-')) {
        console.log('Attempting OpenRouter...');
        try {
          const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${openRouterKey}`,
              'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
              'X-Title': 'Elatyab Market AI Assistant'
            },
            body: JSON.stringify({
              model: 'liquid/lfm-2.5-1.2b-thinking:free', // Using a very stable free model
              messages: [
                { role: 'system', content: systemPrompt },
                ...messages.slice(-6).map(m => ({
                  role: m.role === 'user' ? 'user' : 'assistant',
                  content: m.content
                })),
                { role: 'user', content: userMessage }
              ],
              max_tokens: 1000,
              temperature: 0.7
            })
          });

          if (response.ok) {
            const data = await response.json();
            aiResponse = data.choices?.[0]?.message?.content;
            console.log('OpenRouter success');
          } else {
            const err = await response.json().catch(() => ({}));
            console.warn('OpenRouter failed, status:', response.status, err);
            // If it's a 401/403, we know the key is the issue
            if (response.status === 401 || response.status === 403) {
              console.error('OpenRouter API Key appears invalid or expired');
            }
          }
        } catch (e) {
          console.warn('OpenRouter fetch error:', e);
        }
      }

      // Fallback to Gemini
      if (!aiResponse && geminiKey) {
        console.log('Attempting Gemini Fallback...');
        try {
          // Using gemini-1.5-flash which is much more reliable and faster
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${geminiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [
                  {
                    role: 'user',
                    parts: [{ text: systemPrompt + "\n\nUser Question: " + userMessage }]
                  }
                ],
                generationConfig: {
                  maxOutputTokens: 1000,
                  temperature: 0.7
                }
              })
            }
          );

          if (response.ok) {
            const data = await response.json();
            aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log('Gemini success');
          } else {
            const err = await response.json().catch(() => ({}));
            console.warn('Gemini failed, status:', response.status, err);
          }
        } catch (e) {
          console.warn('Gemini fallback failed:', e);
        }
      }

      if (!aiResponse) {
        throw new Error(language === 'ar'
          ? 'تعذر الاتصال بالسيرفر. يرجى التأكد من صلاحية المفاتيح وتوفر رصيد في OpenRouter أو Gemini.'
          : 'Could not connect to AI. Please ensure keys are valid and have credits.');
      }

      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);

    } catch (error: any) {
      console.error('❌ AI Error:', error);

      let errorMsg = '';
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        errorMsg = language === 'ar'
          ? '⚠️ تم تجاوز الحد المسموح. انتظر قليلاً وحاول مجدداً'
          : '⚠️ Rate limit exceeded. Please wait and try again';
      } else if (error.message?.includes('401') || error.message?.includes('403')) {
        errorMsg = language === 'ar'
          ? '❌ مفتاح API غير صالح. تحقق من الإعدادات'
          : '❌ Invalid API key. Check settings';
      } else {
        errorMsg = language === 'ar'
          ? `❌ حدث خطأ: ${error.message}`
          : `❌ Error: ${error.message}`;
      }

      setMessages(prev => [...prev, { role: 'ai', content: errorMsg }]);
      toast.error(error.message);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-32 px-4 bg-fruit-bg relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(45,138,78,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-fruit-primary/10 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-2xl mx-auto h-[calc(100vh-220px)] flex flex-col relative z-10">

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 bg-white/5 backdrop-blur-xl p-4 rounded-[24px] border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-fruit-primary/20 rounded-2xl flex items-center justify-center text-fruit-primary shadow-lg shadow-fruit-primary/20">
              <Brain size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">{t.aiAssistant}</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  Assistant Active
                </span>
              </div>
            </div>
          </div>

          {/* Products status badge */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${productsLoaded
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
              <ShoppingBasket size={12} />
              {loadingProducts
                ? (language === 'ar' ? 'جاري التحميل...' : 'Loading...')
                : productsLoaded
                  ? `${products.length} ${language === 'ar' ? 'منتج' : 'products'}`
                  : (language === 'ar' ? 'خطأ' : 'Error')}
            </div>
            <button
              onClick={loadProducts}
              disabled={loadingProducts}
              className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all disabled:opacity-50"
              title={language === 'ar' ? 'تحديث المنتجات' : 'Refresh products'}
            >
              <RefreshCw size={14} className={loadingProducts ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar"
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeInUp`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`max-w-[85%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user'
                  ? 'bg-fruit-accent/20 text-fruit-accent'
                  : 'bg-fruit-primary/20 text-fruit-primary'
                  }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-[20px] text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                  ? 'bg-fruit-accent text-white rounded-tr-none'
                  : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                  }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/5 p-4 rounded-[20px] rounded-tl-none border border-white/10 flex gap-2">
                <span className="w-1.5 h-1.5 bg-fruit-primary rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-fruit-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-fruit-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Quick suggestion chips */}
        {messages.length === 1 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {(language === 'ar'
              ? ['ما هو أرخص منتج؟', 'فوائد الموز', 'ما المتاح اليوم؟', 'قارن بين التفاح والبرتقال']
              : ['Cheapest product?', 'Benefits of banana', "What's available?", 'Compare apple vs orange']
            ).map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setInput(suggestion)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={language === 'ar' ? 'اسألني عن أي منتج أو فائدة صحية...' : 'Ask about any product or health benefit...'}
            className="w-full bg-white/5 border border-white/10 rounded-[24px] py-4 pr-14 pl-6 text-white outline-none focus:border-fruit-primary focus:bg-white/10 transition-all backdrop-blur-xl"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-fruit-primary text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send size={18} className={language === 'ar' ? 'rotate-180' : ''} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AIAssistant;
