// ============================================
// EXAMPLE USAGE - SUPABASE INTEGRATION
// Copy these examples to your React Native screens
// ============================================

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Alert,
  StyleSheet 
} from 'react-native';

import {
  authService,
  categoryService,
  productService,
  cartService,
  orderService,
  wishlistService,
  addressService,
  walletService,
} from './src/services/supabaseService';

// ============================================
// EXAMPLE 1: HOME SCREEN - Display Categories & Products
// ============================================

export const HomeScreen = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // Load categories
      const categoriesResult = await categoryService.getCategories();
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }

      // Load featured products
      const productsResult = await productService.getFeaturedProducts();
      if (productsResult.success) {
        setFeaturedProducts(productsResult.data);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name_en}</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: item.images[0] }} 
        style={styles.productImage} 
      />
      <Text style={styles.productName}>{item.name_en}</Text>
      <Text style={styles.productPrice}>{item.price} EGP</Text>
      {item.discount_percent > 0 && (
        <Text style={styles.discount}>-{item.discount_percent}%</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Categories Section */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        showsHorizontalScrollIndicator={false}
      />

      {/* Featured Products Section */}
      <Text style={styles.sectionTitle}>Featured Products</Text>
      <FlatList
        data={featuredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        numColumns={2}
      />
    </View>
  );
};

// ============================================
// EXAMPLE 2: PRODUCT DETAIL SCREEN
// ============================================

export const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
    checkWishlistStatus();
  }, [productId]);

  const loadProduct = async () => {
    const result = await productService.getProductById(productId);
    if (result.success) {
      setProduct(result.data);
    }
  };

  const checkWishlistStatus = async () => {
    const userId = 'USER_ID_HERE'; // Get from auth context
    const result = await wishlistService.isInWishlist(userId, productId);
    if (result.success) {
      setIsInWishlist(result.isInWishlist);
    }
  };

  const handleAddToCart = async () => {
    const userId = 'USER_ID_HERE'; // Get from auth context
    const result = await cartService.addToCart(userId, productId, quantity);
    
    if (result.success) {
      Alert.alert('Success', 'Added to cart!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleToggleWishlist = async () => {
    const userId = 'USER_ID_HERE'; // Get from auth context
    
    if (isInWishlist) {
      await wishlistService.removeFromWishlist(userId, productId);
      setIsInWishlist(false);
    } else {
      await wishlistService.addToWishlist(userId, productId);
      setIsInWishlist(true);
    }
  };

  if (!product) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.images[0] }} style={styles.detailImage} />
      <Text style={styles.productTitle}>{product.name_en}</Text>
      <Text style={styles.productDescription}>{product.description_en}</Text>
      <Text style={styles.price}>{product.price} EGP</Text>
      
      {/* Quantity selector */}
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Action buttons */}
      <TouchableOpacity onPress={handleAddToCart} style={styles.addToCartButton}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleToggleWishlist}>
        <Text>{isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// EXAMPLE 3: CART SCREEN
// ============================================

export const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const userId = 'USER_ID_HERE'; // Get from auth context
    const result = await cartService.getCart(userId);
    
    if (result.success) {
      setCartItems(result.data);
      calculateTotal(result.data);
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((total, item) => {
      return total + (item.products.price * item.quantity);
    }, 0);
    setTotal(sum);
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const result = await cartService.updateCartItem(cartItemId, newQuantity);
    if (result.success) {
      loadCart(); // Reload cart
    }
  };

  const removeItem = async (cartItemId) => {
    const result = await cartService.removeFromCart(cartItemId);
    if (result.success) {
      loadCart(); // Reload cart
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image 
        source={{ uri: item.products.images[0] }} 
        style={styles.cartItemImage} 
      />
      <View style={styles.cartItemDetails}>
        <Text>{item.products.name_en}</Text>
        <Text>{item.products.price} EGP</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Text>-</Text>
          </TouchableOpacity>
          <Text>{item.quantity}</Text>
          <TouchableOpacity 
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Text style={styles.removeButton}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
      />
      
      <View style={styles.cartFooter}>
        <Text style={styles.totalText}>Total: {total} EGP</Text>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.buttonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ============================================
// EXAMPLE 4: CHECKOUT & ORDER CREATION
// ============================================

export const CheckoutScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');

  useEffect(() => {
    loadCheckoutData();
  }, []);

  const loadCheckoutData = async () => {
    const userId = 'USER_ID_HERE';
    
    // Load cart
    const cartResult = await cartService.getCart(userId);
    if (cartResult.success) {
      setCartItems(cartResult.data);
    }

    // Load default address
    const addressResult = await addressService.getAddresses(userId);
    if (addressResult.success) {
      const defaultAddr = addressResult.data.find(addr => addr.is_default);
      setSelectedAddress(defaultAddr || addressResult.data[0]);
    }
  };

  const handlePlaceOrder = async () => {
    const userId = 'USER_ID_HERE';

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => 
      sum + (item.products.price * item.quantity), 0
    );
    const deliveryFee = 10;
    const total = subtotal + deliveryFee;

    // Create order
    const orderData = {
      delivery_address: selectedAddress.full_address,
      delivery_phone: selectedAddress.phone,
      delivery_latitude: selectedAddress.latitude,
      delivery_longitude: selectedAddress.longitude,
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      total: total,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
      status: 'pending',
    };

    const orderResult = await orderService.createOrder(userId, orderData);

    if (orderResult.success) {
      // Add order items
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id,
        product_name_en: item.products.name_en,
        product_name_ar: item.products.name_ar,
        product_image: item.products.images[0],
        weight: item.products.weight,
        quantity: item.quantity,
        unit_price: item.products.price,
        total_price: item.products.price * item.quantity,
      }));

      await orderService.addOrderItems(orderResult.data.id, orderItems);

      // Clear cart
      await cartService.clearCart(userId);

      // Navigate to success screen
      Alert.alert(
        'Success!', 
        `Order placed successfully! Order #${orderResult.data.order_number}`
      );
    } else {
      Alert.alert('Error', 'Failed to place order');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Delivery Address</Text>
      {selectedAddress && (
        <Text>{selectedAddress.full_address}</Text>
      )}

      <Text style={styles.sectionTitle}>Payment Method</Text>
      <TouchableOpacity onPress={() => setPaymentMethod('cod')}>
        <Text>{paymentMethod === 'cod' ? '✅' : '⭕'} Cash on Delivery</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setPaymentMethod('wallet')}>
        <Text>{paymentMethod === 'wallet' ? '✅' : '⭕'} Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.placeOrderButton} 
        onPress={handlePlaceOrder}
      >
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// EXAMPLE 5: ORDERS SCREEN
// ============================================

export const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const userId = 'USER_ID_HERE';
    const result = await orderService.getOrders(userId);
    
    if (result.success) {
      setOrders(result.data);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA726',
      confirmed: '#42A5F5',
      packed: '#66BB6A',
      shipped: '#AB47BC',
      delivered: '#26A69A',
      cancelled: '#EF5350',
    };
    return colors[status] || '#757575';
  };

  const renderOrder = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>Order #{item.order_number}</Text>
        <Text 
          style={[
            styles.orderStatus, 
            { color: getStatusColor(item.status) }
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>
      
      <Text>Total: {item.total} EGP</Text>
      <Text>Items: {item.order_items.length}</Text>
      <Text>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
      />
    </View>
  );
};

// ============================================
// EXAMPLE 6: AUTHENTICATION
// ============================================

export const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {
    const result = await authService.signUpWithPhone(phone);
    if (result.success) {
      setOtpSent(true);
      Alert.alert('Success', 'OTP sent to your phone!');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleVerifyOTP = async () => {
    const result = await authService.verifyOTP(phone, otp);
    if (result.success) {
      Alert.alert('Success', 'Logged in successfully!');
      // Navigate to home screen
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <View style={styles.container}>
      {!otpSent ? (
        <>
          <TextInput
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleSendOTP} style={styles.button}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            style={styles.input}
          />
          <TouchableOpacity onPress={handleVerifyOTP} style={styles.button}>
            <Text style={styles.buttonText}>Verify OTP</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

// ============================================
// EXAMPLE 7: WALLET SCREEN
// ============================================

export const WalletScreen = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    const userId = 'USER_ID_HERE';
    
    // Load wallet balance
    const walletResult = await walletService.getWallet(userId);
    if (walletResult.success) {
      setWallet(walletResult.data);
    }

    // Load transactions
    const transactionsResult = await walletService.getTransactions(userId);
    if (transactionsResult.success) {
      setTransactions(transactionsResult.data);
    }
  };

  const handleAddMoney = async (amount) => {
    const userId = 'USER_ID_HERE';
    const result = await walletService.addMoney(userId, amount);
    
    if (result.success) {
      Alert.alert('Success', 'Money added to wallet!');
      loadWalletData();
    }
  };

  return (
    <View style={styles.container}>
      {/* Balance Card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <Text style={styles.balanceAmount}>
          {wallet?.balance || 0} EGP
        </Text>
      </View>

      {/* Add Money Buttons */}
      <View style={styles.rechargeButtons}>
        <TouchableOpacity onPress={() => handleAddMoney(50)}>
          <Text>+ 50 EGP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAddMoney(100)}>
          <Text>+ 100 EGP</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleAddMoney(200)}>
          <Text>+ 200 EGP</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction History */}
      <Text style={styles.sectionTitle}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>{item.description}</Text>
            <Text style={{ 
              color: item.type === 'credit' ? 'green' : 'red' 
            }}>
              {item.type === 'credit' ? '+' : '-'}{item.amount} EGP
            </Text>
          </View>
        )}
      />
    </View>
  );
};

// ============================================
// BASIC STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 12,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  productName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
});
