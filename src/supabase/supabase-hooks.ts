import { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase-config';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { authService, walletService, cartService } from './supabase-service';

// Types
export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
  is_admin?: boolean;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  transaction_type: 'charge' | 'payment' | 'refund' | 'transfer';
  amount: number;
  status: string;
  description: string;
  created_at: string;
}

export interface CartItemWithProduct {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  products: any;
}

// Auth Hook
export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: { full_name: string; phone_number?: string }) => {
    // Step 1: Sign up the user via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: userData }
    });

    if (error) return { data, error };

    // Step 2: If signup successful, create user profile and wallet manually
    if (data.user) {
      try {
        // Create user profile
        const profileResult = await (supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name: userData.full_name,
            phone_number: userData.phone_number || ''
          }) as any);

        if (profileResult.error) {
          console.error('Error creating user profile:', profileResult.error);
          // Don't return error here - the auth user was created successfully
        }

        // Create wallet
        const walletResult = await (supabase
          .from('wallets')
          .insert({
            user_id: data.user.id,
            balance: 0.00,
            currency: 'EGP'
          }) as any);

        if (walletResult.error) {
          console.error('Error creating wallet:', walletResult.error);
          // Don't return error here - the auth user was created successfully
        }
      } catch (err) {
        console.error('Error in post-signup setup:', err);
        // Don't return error here - the auth user was created successfully
      }
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  };

  return { user, setUser, loading, signUp, signIn, signOut, resetPassword };
}

// User Data Hook
export function useUser() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) setUserData(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const updateUser = async (updates: Partial<User>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No user' };

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (!error) setUserData(data);
    return { data, error };
  };

  return { userData, setUserData, loading, updateUser, refetch: fetchUserData };
}

// Wallet Hook
export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWalletData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const walletRes = await walletService.getWallet(user.id);
      if (walletRes.success) setWallet(walletRes.data as any);

      const transRes = await walletService.getTransactions(user.id);
      if (transRes.success) {
        const formattedTransactions = transRes.data.map((tx: any) => ({ ...tx, wallet_id: walletRes.data.id, status: 'succeeded' }));
        setTransactions(formattedTransactions);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const chargeWallet = async (amount: number, description?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No user' };
    const res = await walletService.addMoney(user.id, amount);
    if (res.success) await fetchWalletData();
    return res;
  };

  const processPayment = async (orderId: string, amount: number, description?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No user' };
    const { data, error } = await supabase.rpc('process_wallet_payment', {
      p_user_id: user.id,
      p_amount: amount,
      p_order_id: orderId,
      p_description: description
    });
    if (!error) await fetchWalletData();
    return { data, error };
  };

  return { wallet, transactions, loading, chargeWallet, processPayment, refetch: fetchWalletData };
}

// Cart Hook
export function useCart() {
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartTotal, setCartTotal] = useState(0);

  const fetchCart = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const res = await cartService.getCart(user.id);
      if (res.success) {
        setCartItems(res.data);
        const total = res.data.reduce((sum: number, item: any) => sum + (item.products.price * item.quantity), 0);
        setCartTotal(total);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No user' };
    const res = await cartService.addToCart(user.id, productId);
    if (res.success) await fetchCart();
    return res;
  };

  const updateCartItem = async (itemId: string, quantity: number) => {
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('id', itemId)
      .select()
      .single();
    if (!error) await fetchCart();
    return { data, error };
  };

  const removeFromCart = async (itemId: string) => {
    const res = await cartService.removeFromCart(itemId);
    if (res.success) await fetchCart();
    return res;
  };

  const clearCart = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'No user' };
    const { error } = await (supabase.from('cart').delete().eq('user_id', user.id) as any);
    if (!error) setCartItems([]);
    return { error };
  };

  return { cartItems, loading, cartTotal, addToCart, updateCartItem, removeFromCart, clearCart, refetch: fetchCart };
}