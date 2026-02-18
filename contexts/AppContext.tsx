
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../translations';
import { orderService, cartService, walletService, GUEST_USER_ID } from '../src/supabase/supabase-service';
import { useAuthContext } from '../src/supabase/context-providers';
import { supabase } from '../src/supabase/supabase-config';
import toast from 'react-hot-toast';

// ... (interfaces)

interface CartItem {
  product_id: string;
  quantity: number;
  price: number;
  [key: string]: any;
}

interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations['ar'];
  cart: CartItem[];
  addToCart: (product: any) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  placeOrder: () => Promise<boolean>;
  cartTotal: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: any;
  setUser: (user: any) => void;
  loading: boolean;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  walletBalance: number;
  cartCount: number;
  updateQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  totalPoints: number;
  pointsPop: boolean;
  refreshWallet: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [walletBalance, setWalletBalance] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [pointsPop, setPointsPop] = useState(false);

  const { user, setUser, loading } = useAuthContext();
  const t = translations[language];

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchWalletBalance();
    }
  }, [user]);

  const fetchWalletBalance = async () => {
    if (!user?.id) return;
    const { data, success } = await walletService.getWallet(user.id);
    console.log("AppContext: Fetched wallet data:", data);
    if (success && data) {
      setWalletBalance(data.balance);
      setTotalPoints(data.points_balance || 0);
    }
  };

  const fetchCart = async () => {
    const { data, success } = await cartService.getCart(user?.id || GUEST_USER_ID);
    if (success && data) {
      setCart(data);
    }
  };

  const addToCart = async (product: any) => {
    // Save to DB
    const existingItem = cart.find(item => item.product_id === product.id);
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1);
    } else {
      const { data, success } = await cartService.addToCart(user?.id || GUEST_USER_ID, product.id);
      if (success && data) {
        // Ensure nesting matches what components expect (item.products.image_url etc)
        const newItem = { ...data[0], products: product };
        setCart([...cart, newItem]);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    const { success } = await cartService.removeFromCart(user?.id || GUEST_USER_ID, id);
    if (success) {
      setCart(cart.filter(item => item.product_id !== id));
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const { data, success } = await cartService.updateQuantity(user?.id || GUEST_USER_ID, productId, newQuantity);
    if (success && data) {
      // Re-merge product data because upsert only returns the cart row
      const existingProduct = cart.find(item => item.product_id === productId)?.products || {};
      const updatedItem = { ...data[0], products: existingProduct };
      setCart(cart.map(item => item.product_id === productId ? updatedItem : item));
    }
  };

  const clearCart = async () => {
    // In a real app, clear from database too
    setCart([]);
  };

  const placeOrder = async (): Promise<boolean> => {
    if (cart.length === 0) return false;

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const loadingToast = toast.loading(t.placingOrder);

    if (paymentMethod === 'wallet' && walletBalance < cartTotal) {
      toast.error(t.insufficientBalance, { id: loadingToast });
      return false;
    }

    try {
      const currentUserId = user?.id || GUEST_USER_ID;
      const deliveryAddress = user?.user_metadata;

      if (!deliveryAddress || !deliveryAddress.city || !deliveryAddress.address_line1) {
        toast.error(t.noAddress, { id: loadingToast });
        return false;
      }

      const orderData = {
        user_id: currentUserId,
        total_amount: cartTotal,
        payment_method: paymentMethod,
        status: paymentMethod === 'wallet' ? 'confirmed' : 'pending_confirmation',
        delivery_address: deliveryAddress
      };

      const result = await orderService.createOrder(orderData, cart);

      if (result.success) {
        const orderId = result.data.id;
        const orderNumber = result.data.order_number;

        // Items for email
        const emailItems = cart.map(item => ({
          name: language === 'ar' ? item.products.name_ar : item.products.name_en,
          quantity: item.quantity,
          price: item.price
        }));

        const orderDetailsForEmail = {
          orderId: orderNumber,
          total: cartTotal,
          items: emailItems,
          customerEmail: user.email,
          phone: deliveryAddress.phone || user.phone || 'غير مسجل',
          deliveryAddress: `${deliveryAddress.city || ''}, ${deliveryAddress.address_line1 || ''}`
        };

        // 1. Send User Confirmation Email
        supabase.functions.invoke('send-email', {
          body: {
            type: 'order-confirmation',
            to: user.email,
            userName: deliveryAddress.full_name || user.email,
            orderDetails: orderDetailsForEmail
          }
        }).catch(err => console.error('User email failed:', err));

        // 2. Send Admin Notification Email
        supabase.functions.invoke('send-email', {
          body: {
            type: 'admin-order-notification',
            to: 'omm651571@gmail.com',
            userName: deliveryAddress.full_name || user.email,
            orderDetails: orderDetailsForEmail
          }
        }).catch(err => console.error('Admin email failed:', err));

        // 3. Award BTS Points for purchase
        const btsToEarn = Math.round(cartTotal * 1.5);
        if (user?.id) {
          await walletService.addPoints(user.id, btsToEarn, `Purchase Award for Order ${orderNumber}`);
        }
        setTotalPoints(prev => prev + btsToEarn);
        setPointsPop(true);
        setTimeout(() => setPointsPop(false), 2000);

        toast.success(t.orderPlaced, { id: loadingToast });
        clearCart();
        fetchCart();
        if (paymentMethod === 'wallet') fetchWalletBalance();
        return true;
      } else {
        toast.error(t.orderFailed, { id: loadingToast });
        return false;
      }
    } catch (error: any) {
      toast.error(error.message || t.unexpectedError, { id: loadingToast });
      return false;
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider value={{
      language, setLanguage, t, cart, addToCart, removeFromCart, placeOrder, cartTotal, searchQuery, setSearchQuery, user, setUser, loading,
      paymentMethod, setPaymentMethod, walletBalance, cartCount, updateQuantity, clearCart,
      totalPoints, pointsPop, refreshWallet: fetchWalletBalance
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
