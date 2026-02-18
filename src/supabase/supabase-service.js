"use client";

import { supabase } from './supabase-config';
import * as dataLoader from '../utils/dataLoader';

export const GUEST_USER_ID = '00000000-0000-0000-0000-000000000000';

const normalizeProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    name_ar: p.name_ar || p.name,
    name_en: p.name_en || p.nameEn,
    description_ar: p.description_ar || p.desc,
    image_url: p.image_url || (p.images && p.images[0]) || p.image,
    images: p.images || [p.image_url || p.image].filter(Boolean),
    price: parseFloat(p.price || 0),
    unit: p.unit || 'كيلو'
  };
};

export const productService = {
  getProductsByCategory: async (catIdOrName) => {
    try {
      // 1. محاولة الجلب من Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', catIdOrName);

      // 2. إذا نجح الطلب ووجد بيانات، نعيدها
      if (!error && data && data.length > 0) {
        return { success: true, data: data.map(normalizeProduct) };
      }

      // 3. إذا لم يجد بيانات (مصفوفة فارغة) أو حدث خطأ، ننتقل للملف المحلي
      throw new Error("No data in Supabase, falling back to local JSON");
    } catch (e) {
      console.log("Using local products fallback for:", catIdOrName);
      // البحث في الملف المحلي باستخدام المعرف أو الاسم
      const localData = dataLoader.getProductsByCategory(catIdOrName);
      return { success: true, data: localData.map(normalizeProduct) };
    }
  },
  getFeaturedProducts: async () => {
    const data = dataLoader.getFeaturedOffers();
    return { success: true, data: data.map(normalizeProduct) };
  },
  getAllProducts: async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) return { success: true, data: data.map(normalizeProduct) };
      throw new Error();
    } catch (e) {
      return { success: true, data: dataLoader.getAllProducts().map(normalizeProduct) };
    }
  }
};

export const categoryService = {
  getCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data && data.length > 0) return { success: true, data };
      throw new Error("No categories in DB");
    } catch (e) {
      return { success: true, data: dataLoader.getAllCategories() };
    }
  },
  addCategory: async (category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      return { success: !error, data, error };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  updateCategory: async (id, category) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      return { success: !error, data, error };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  deleteCategory: async (id) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      return { success: !error, error };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};

export const recipeService = {
  getRecipes: async () => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) return { success: true, data };
      throw error || new Error("No recipes found");
    } catch (e) {
      console.error("Error fetching recipes:", e);
      return { success: false, error: e.message };
    }
  },
  getRecipeById: async (id) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) return { success: true, data };
      throw error;
    } catch (e) {
      return { success: false, error: e.message };
    }
  },
  addRecipe: async (recipe) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert([recipe])
        .select();
      return { success: !error, data, error };
    } catch (e) { return { success: false, error: e.message }; }
  },
  updateRecipe: async (id, recipe) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update(recipe)
        .eq('id', id)
        .select();
      return { success: !error, data, error };
    } catch (e) { return { success: false, error: e.message }; }
  },
  deleteRecipe: async (id) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
      return { success: !error, error };
    } catch (e) { return { success: false, error: e.message }; }
  }
};

// ... بقية الخدمات (authService, orderService, etc.) تبقى كما هي
export const authService = {
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { success: !error, error: error?.message };
  },
  getCurrentUser: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) return { success: true, user };
      throw new Error();
    } catch (error) {
      return { success: true, user: { id: GUEST_USER_ID, email: 'guest@elatyab.com', user_metadata: { full_name: 'زائر الأطيب' } } };
    }
  }
};

export const cartService = {
  getCart: async (userId) => {
    try {
      const { data, error } = await supabase.from('cart').select('*, products(*)').eq('user_id', userId);
      return { success: !error, data: data || [] };
    } catch (e) { return { success: true, data: [] }; }
  },
  addToCart: async (userId, product_id, quantity = 1) => {
    try {
      const { data, error } = await supabase.from('cart').upsert({ user_id: userId, product_id, quantity }, { onConflict: 'user_id, product_id' }).select();
      return { success: !error, data };
    } catch (e) { return { success: false }; }
  }
};

export const walletService = {
  PROFIT_MULTIPLIER: 1.5, // 50% Profit Bonus
  getWallet: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert([{ user_id: userId, balance: 0, points_balance: 0 }])
          .select()
          .single();
        if (createError) throw createError;
        return { success: true, data: newWallet };
      }

      if (error) throw error;
      return { success: true, data };
    } catch (e) {
      console.error("Wallet error:", e);
      return { success: false, error: e.message };
    }
  },
  addMoney: async (userId, amount, description = 'Recharge') => {
    try {
      const walletRes = await walletService.getWallet(userId);
      if (!walletRes.success) throw new Error(walletRes.error);
      const wallet = walletRes.data;

      const newBalance = parseFloat(wallet.balance) + parseFloat(amount);
      const { data: updatedWallet, error: updateError } = await supabase
        .from('wallets')
        .update({ balance: newBalance, updated_at: new Date() })
        .eq('id', wallet.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update Monthly Stats (Profit)
      const currentMonth = new Date().toISOString().slice(0, 7);
      await supabase.from('user_monthly_stats').upsert({
        user_id: userId,
        month: currentMonth,
        profit_earned: 0 // Will initialize if not exists
      }, { onConflict: 'user_id, month' });

      // Fetch or use RPC to increment
      const { data: stats } = await supabase
        .from('user_monthly_stats')
        .select('profit_earned')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single();

      await supabase
        .from('user_monthly_stats')
        .update({
          profit_earned: (parseFloat(stats?.profit_earned || 0) + parseFloat(amount)),
          updated_at: new Date()
        })
        .eq('user_id', userId)
        .eq('month', currentMonth);

      // 3. Record transaction
      await supabase
        .from('wallet_transactions')
        .insert([{
          wallet_id: wallet.id,
          transaction_type: 'charge',
          amount: amount,
          status: 'completed',
          description: description
        }]);

      return { success: true, data: updatedWallet };
    } catch (e) {
      console.error("Add money error:", e);
      return { success: false, error: e.message };
    }
  },
  addPoints: async (userId, points, description = 'Loyalty points added') => {
    try {
      const walletRes = await walletService.getWallet(userId);
      if (!walletRes.success) throw new Error(walletRes.error);
      const wallet = walletRes.data;

      const newPoints = (wallet.points_balance || 0) + Math.round(points);

      // Update points_balance
      const { data: updatedWallet, error: updateError } = await supabase
        .from('wallets')
        .update({ points_balance: newPoints, updated_at: new Date() })
        .eq('id', wallet.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update Monthly Stats
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const { error: statsError } = await supabase.rpc('increment_monthly_stats', {
        p_user_id: userId,
        p_month: currentMonth,
        p_points: Math.round(points)
      });

      // Fallback if RPC doesn't exist (UPSERT logic)
      if (statsError) {
        const { data: currentStats } = await supabase
          .from('user_monthly_stats')
          .select('*')
          .eq('user_id', userId)
          .eq('month', currentMonth)
          .single();

        if (currentStats) {
          await supabase
            .from('user_monthly_stats')
            .update({
              points_earned: currentStats.points_earned + Math.round(points),
              updated_at: new Date()
            })
            .eq('id', currentStats.id);
        } else {
          await supabase
            .from('user_monthly_stats')
            .insert([{
              user_id: userId,
              month: currentMonth,
              points_earned: Math.round(points)
            }]);
        }
      }

      return { success: true, data: updatedWallet };
    } catch (e) {
      console.error("Add points error:", e);
      return { success: false, error: e.message };
    }
  },
  getMonthlyStats: async (userId) => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const { data, error } = await supabase
        .from('user_monthly_stats')
        .select('*')
        .eq('user_id', userId)
        .eq('month', currentMonth)
        .single();

      if (error && error.code === 'PGRST116') return { success: true, data: { points_earned: 0, profit_earned: 0 } };
      return { success: !error, data };
    } catch (e) { return { success: false }; }
  },
  getTransactions: async (userId) => {
    try {
      const walletRes = await walletService.getWallet(userId);
      if (!walletRes.success) return { success: true, data: [] };

      const { data, error } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('wallet_id', walletRes.data.id)
        .order('created_at', { ascending: false });

      return { success: !error, data: data || [] };
    } catch (e) { return { success: true, data: [] }; }
  }
};

export const orderService = {
  createOrder: async (orderData, items) => {
    try {
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

      // 1. Insert into orders table
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          order_number: orderNumber,
          status: 'pending'
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert into order_items table
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Send email notification to admin
      try {
        // Dynamically import the email service
        const { sendOrderNotificationToAdmin } = await import('../services/emailService.js');

        // Send email notification (don't wait for it to complete)
        sendOrderNotificationToAdmin(order, items).then(result => {
          if (result.success) {
            console.log('✅ Admin email notification sent successfully');
          } else {
            console.warn('⚠️ Failed to send admin email notification:', result.error);
          }
        }).catch(err => {
          console.warn('⚠️ Email notification error:', err);
        });
      } catch (emailError) {
        // Don't fail the order if email fails
        console.warn('⚠️ Could not send email notification:', emailError);
      }

      return { success: true, data: order };
    } catch (error) {
      console.error('Error creating order:', error);
      return { success: false, error: error.message };
    }
  }
};
