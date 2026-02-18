# 🚀 Supabase Quick Reference Cheat Sheet

## 📦 Import Services
```javascript
import {
  authService,
  categoryService,
  productService,
  cartService,
  orderService,
  addressService,
  walletService,
  wishlistService,
  reviewService,
  offerService,
} from './src/services/supabaseService';
```

---

## 🔐 Authentication

### Sign Up / Login with Phone
```javascript
const result = await authService.signUpWithPhone('+201234567890');
```

### Verify OTP
```javascript
const result = await authService.verifyOTP(phone, otpCode);
```

### Get Current User
```javascript
const result = await authService.getCurrentUser();
const user = result.user;
```

### Sign Out
```javascript
await authService.signOut();
```

---

## 👤 Profile Management

### Get Profile
```javascript
const result = await profileService.getProfile(userId);
const profile = result.data;
```

### Update Profile
```javascript
await profileService.updateProfile(userId, {
  name: 'John Doe',
  phone: '+201234567890',
  language: 'en',
});
```

---

## 📂 Categories

### Get All Categories
```javascript
const result = await categoryService.getCategories();
const categories = result.data;
```

---

## 🛍️ Products

### Get All Products
```javascript
const result = await productService.getAllProducts(limit = 50);
const products = result.data;
```

### Get Products by Category
```javascript
const result = await productService.getProductsByCategory(categoryId);
```

### Get Featured Products
```javascript
const result = await productService.getFeaturedProducts();
```

### Get Product Details
```javascript
const result = await productService.getProductById(productId);
const product = result.data;
```

### Search Products
```javascript
const result = await productService.searchProducts('apple', 'en');
```

---

## 🛒 Cart

### Get User's Cart
```javascript
const result = await cartService.getCart(userId);
const cartItems = result.data;
```

### Add to Cart
```javascript
await cartService.addToCart(userId, productId, quantity = 1);
```

### Update Quantity
```javascript
await cartService.updateCartItem(cartItemId, newQuantity);
```

### Remove from Cart
```javascript
await cartService.removeFromCart(cartItemId);
```

### Clear Cart
```javascript
await cartService.clearCart(userId);
```

---

## 📍 Addresses

### Get All Addresses
```javascript
const result = await addressService.getAddresses(userId);
const addresses = result.data;
```

### Add Address
```javascript
await addressService.addAddress(userId, {
  label: 'Home',
  full_address: '123 Main St, Cairo',
  city: 'Cairo',
  area: 'Nasr City',
  phone: '+201234567890',
  latitude: 30.0444,
  longitude: 31.2357,
  is_default: true,
});
```

### Update Address
```javascript
await addressService.updateAddress(addressId, {
  full_address: 'Updated address',
});
```

### Delete Address
```javascript
await addressService.deleteAddress(addressId);
```

### Set Default Address
```javascript
await addressService.setDefaultAddress(userId, addressId);
```

---

## 💰 Wallet

### Get Wallet Balance
```javascript
const result = await walletService.getWallet(userId);
const balance = result.data.balance;
```

### Get Transactions
```javascript
const result = await walletService.getTransactions(userId, limit = 50);
const transactions = result.data;
```

### Add Money
```javascript
await walletService.addMoney(userId, amount, 'Wallet recharge');
```

---

## 📦 Orders

### Create Order
```javascript
const result = await orderService.createOrder(userId, {
  delivery_address: '123 Main St',
  delivery_phone: '+201234567890',
  subtotal: 100,
  delivery_fee: 10,
  total: 110,
  payment_method: 'cod', // 'cod', 'wallet', 'card'
});
const orderId = result.data.id;
```

### Add Order Items
```javascript
await orderService.addOrderItems(orderId, [
  {
    product_id: 'uuid',
    product_name_en: 'Apple',
    product_name_ar: 'تفاح',
    product_image: 'url',
    weight: '1kg',
    quantity: 2,
    unit_price: 50,
    total_price: 100,
  },
]);
```

### Get User's Orders
```javascript
const result = await orderService.getOrders(userId);
const orders = result.data;
```

### Get Order Details
```javascript
const result = await orderService.getOrderById(orderId);
const order = result.data;
```

### Update Order Status
```javascript
await orderService.updateOrderStatus(orderId, 'confirmed');
// Status options: 'pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'
```

---

## ❤️ Wishlist

### Get Wishlist
```javascript
const result = await wishlistService.getWishlist(userId);
const wishlist = result.data;
```

### Add to Wishlist
```javascript
await wishlistService.addToWishlist(userId, productId);
```

### Remove from Wishlist
```javascript
await wishlistService.removeFromWishlist(userId, productId);
```

### Check if in Wishlist
```javascript
const result = await wishlistService.isInWishlist(userId, productId);
const inWishlist = result.isInWishlist;
```

---

## ⭐ Reviews

### Get Product Reviews
```javascript
const result = await reviewService.getProductReviews(productId);
const reviews = result.data;
```

### Add Review
```javascript
await reviewService.addReview(
  userId,
  productId,
  orderId,
  rating = 5, // 1-5
  comment = 'Great product!',
  images = ['url1', 'url2']
);
```

---

## 🎁 Offers

### Get Active Offers
```javascript
const result = await offerService.getActiveOffers();
const offers = result.data;
```

---

## 🔄 Complete Checkout Flow

```javascript
// 1. Get cart items
const cartResult = await cartService.getCart(userId);
const cartItems = cartResult.data;

// 2. Calculate totals
const subtotal = cartItems.reduce((sum, item) => 
  sum + (item.products.price * item.quantity), 0
);
const deliveryFee = 10;
const total = subtotal + deliveryFee;

// 3. Get default address
const addressResult = await addressService.getAddresses(userId);
const defaultAddress = addressResult.data.find(a => a.is_default);

// 4. Create order
const orderResult = await orderService.createOrder(userId, {
  delivery_address: defaultAddress.full_address,
  delivery_phone: defaultAddress.phone,
  subtotal,
  delivery_fee: deliveryFee,
  total,
  payment_method: 'cod',
});

// 5. Add order items
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

// 6. Clear cart
await cartService.clearCart(userId);

// Done! Order created successfully
```

---

## 🎨 Response Structure

All service functions return:
```javascript
{
  success: boolean,
  data: object | array | null,
  error: string | null
}
```

### Usage Pattern
```javascript
const result = await someService.someFunction();

if (result.success) {
  // Use result.data
  console.log(result.data);
} else {
  // Handle error
  console.error(result.error);
  Alert.alert('Error', result.error);
}
```

---

## 🔍 Common SQL Queries (for Supabase Dashboard)

### Check total products
```sql
SELECT COUNT(*) FROM products;
```

### Get products by category
```sql
SELECT p.name_en, c.name_en as category
FROM products p
JOIN categories c ON p.category_id = c.id;
```

### Get all orders with items
```sql
SELECT o.order_number, o.status, o.total,
       COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id
ORDER BY o.created_at DESC;
```

### Get user's total spending
```sql
SELECT user_id, SUM(total) as total_spent
FROM orders
WHERE status = 'delivered'
GROUP BY user_id;
```

---

## 🐛 Debugging Tips

### Check if Supabase is configured
```javascript
import { isSupabaseConfigured } from './src/config/supabase';

if (!isSupabaseConfigured()) {
  console.error('Supabase not configured! Check your credentials.');
}
```

### Log all responses
```javascript
const result = await productService.getAllProducts();
console.log('Result:', JSON.stringify(result, null, 2));
```

### Test database connection
```javascript
import { supabase } from './src/config/supabase';

const testConnection = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('count')
    .limit(1);
  
  console.log('Connection test:', { data, error });
};
```

---

## 📱 Real-Time Updates (Optional)

### Listen to order updates
```javascript
const subscription = supabase
  .channel('orders')
  .on('postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'orders',
      filter: `user_id=eq.${userId}`
    }, 
    (payload) => {
      console.log('Order updated:', payload.new);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

---

## 🎯 Best Practices

1. **Always check result.success before using data**
2. **Handle errors gracefully with user-friendly messages**
3. **Use try-catch for additional error handling**
4. **Cache data when possible to reduce API calls**
5. **Show loading states while fetching data**
6. **Implement pull-to-refresh for better UX**

---

## 📚 Additional Resources

- [Supabase Docs](https://supabase.com/docs)
- [React Native Docs](https://reactnative.dev)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

---

## 💡 Pro Tips

- Use **React Context** to manage user session globally
- Implement **infinite scroll** for product listings
- Add **image optimization** for better performance
- Use **Supabase Storage** for user-uploaded images
- Implement **caching** with AsyncStorage
- Add **offline support** for better UX

---

**Happy Coding! 🚀**
