# Complete Supabase Integration Guide
## E-Commerce App - Step by Step Setup

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Supabase Project Setup](#supabase-project-setup)
3. [Database Schema Setup](#database-schema-setup)
4. [React Native Configuration](#react-native-configuration)
5. [Testing the Integration](#testing-the-integration)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## 1. Prerequisites

### Required Tools
- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier works)
- React Native development environment

### Install Dependencies
```bash
npm install @supabase/supabase-js
npm install @react-native-async-storage/async-storage
```

---

## 2. Supabase Project Setup

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if you don't have one)
4. Click "New Project"
5. Fill in:
   - **Project name**: `ecommerce-app` (or your choice)
   - **Database password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Pricing plan**: Free tier is fine for development

### Step 2: Get Your Credentials
Once your project is created:

1. Go to **Settings** (gear icon) → **API**
2. Copy and save:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role key**: Keep this SECRET! (for admin operations)

### Step 3: Enable Phone Authentication (Optional)
1. Go to **Authentication** → **Providers**
2. Enable **Phone** provider
3. Configure with your SMS provider (Twilio, etc.)
4. Or use Email authentication for development

---

## 3. Database Schema Setup

### Step 1: Run Schema SQL

1. Open Supabase Dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy entire content from `database-schema.sql`
5. Paste into the editor
6. Click **Run** (bottom right)
7. Wait for success message

**Expected Output:**
```
Success. No rows returned
```

### Step 2: Verify Tables Created

Go to **Table Editor** and verify these tables exist:
- ✅ profiles
- ✅ categories
- ✅ products
- ✅ addresses
- ✅ wallets
- ✅ wallet_transactions
- ✅ cart_items
- ✅ orders
- ✅ order_items
- ✅ offers
- ✅ reviews
- ✅ wishlist

### Step 3: Load Seed Data

1. Go back to **SQL Editor**
2. Click **New Query**
3. Copy entire content from `src/data/complete-products-data.sql`
4. Paste and **Run**
5. Check for success

### Step 4: Verify Data

Run these verification queries:

```sql
-- Check categories (should return 10+)
SELECT COUNT(*) FROM categories;

-- Check products (should return 30+)
SELECT COUNT(*) FROM products;

-- Check if featured products exist
SELECT name_en, price FROM products WHERE is_featured = true;

-- Check offers
SELECT title_en FROM offers WHERE is_active = true;
```

---

## 4. React Native Configuration

### Step 1: Create Supabase Config

Create `src/config/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'YOUR_PROJECT_URL_HERE';
const supabaseAnonKey = 'YOUR_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**⚠️ IMPORTANT:** Replace `YOUR_PROJECT_URL_HERE` and `YOUR_ANON_KEY_HERE` with your actual credentials!

### Step 2: Add Service File

Copy `supabase-service.js` to `src/services/supabaseService.js`

### Step 3: Project Structure

Your project should look like:
```
your-app/
├── src/
│   ├── config/
│   │   └── supabase.js          ← Supabase client config
│   ├── services/
│   │   └── supabaseService.js   ← All API functions
│   ├── screens/
│   ├── components/
│   └── ...
├── package.json
└── ...
```

---

## 5. Testing the Integration

### Test 1: Fetch Categories
```javascript
import { categoryService } from './src/services/supabaseService';

const testCategories = async () => {
  const result = await categoryService.getCategories();
  if (result.success) {
    console.log('Categories:', result.data);
  } else {
    console.error('Error:', result.error);
  }
};

testCategories();
```

### Test 2: Fetch Products
```javascript
import { productService } from './src/services/supabaseService';

const testProducts = async () => {
  const result = await productService.getAllProducts();
  if (result.success) {
    console.log('Products count:', result.data.length);
    console.log('First product:', result.data[0]);
  } else {
    console.error('Error:', result.error);
  }
};

testProducts();
```

### Test 3: Authentication
```javascript
import { authService } from './src/services/supabaseService';

const testAuth = async () => {
  // Check if user is logged in
  const session = await authService.getSession();
  console.log('Current session:', session);
};

testAuth();
```

---

## 6. Common Issues & Solutions

### Issue 1: "Invalid API key" or "Project not found"
**Solution:**
- Double-check your `supabaseUrl` and `supabaseAnonKey`
- Make sure you're using the **anon/public** key, not service_role
- Verify the URL has `https://` and ends with `.supabase.co`

### Issue 2: "Row Level Security policy violation"
**Solution:**
- Check if RLS policies are correctly set up
- For testing, you can temporarily disable RLS:
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```
- Remember to re-enable after testing!

### Issue 3: AsyncStorage not working
**Solution:**
```bash
# Make sure it's properly installed
npm install @react-native-async-storage/async-storage

# For iOS
cd ios && pod install

# Rebuild your app
npm run ios  # or npm run android
```

### Issue 4: "Cannot read property 'data' of undefined"
**Solution:**
Always check the response structure:
```javascript
const result = await productService.getAllProducts();
if (result.success) {
  // ✅ Safe to use result.data
  console.log(result.data);
} else {
  // ❌ Handle error
  console.error(result.error);
}
```

### Issue 5: Products not showing images
**Solution:**
1. Make sure image URLs are valid in your seed data
2. Test by replacing with known working image URL
3. Check network permissions in your app

---

## 7. Usage Examples

### Example 1: Display Products in a Screen
```javascript
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import { productService } from '../services/supabaseService';

const ProductsScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const result = await productService.getAllProducts();
    if (result.success) {
      setProducts(result.data);
    }
    setLoading(false);
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Image source={{ uri: item.images[0] }} style={{ width: 100, height: 100 }} />
          <Text>{item.name_en}</Text>
          <Text>{item.price} EGP</Text>
        </View>
      )}
    />
  );
};

export default ProductsScreen;
```

### Example 2: Add to Cart
```javascript
import { cartService } from '../services/supabaseService';

const handleAddToCart = async (productId, userId) => {
  const result = await cartService.addToCart(userId, productId, 1);
  if (result.success) {
    Alert.alert('Success', 'Added to cart!');
  } else {
    Alert.alert('Error', result.error);
  }
};
```

### Example 3: Create Order
```javascript
import { orderService, cartService } from '../services/supabaseService';

const handleCheckout = async (userId, cartItems, address) => {
  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => 
    sum + (item.products.price * item.quantity), 0
  );
  
  const deliveryFee = 10;
  const total = subtotal + deliveryFee;

  // Create order
  const orderResult = await orderService.createOrder(userId, {
    delivery_address: address.full_address,
    delivery_phone: address.phone,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    payment_method: 'cod',
  });

  if (orderResult.success) {
    // Add order items
    const items = cartItems.map(item => ({
      product_id: item.product_id,
      product_name_en: item.products.name_en,
      product_name_ar: item.products.name_ar,
      product_image: item.products.images[0],
      weight: item.products.weight,
      quantity: item.quantity,
      unit_price: item.products.price,
      total_price: item.products.price * item.quantity,
    }));

    await orderService.addOrderItems(orderResult.data.id, items);
    
    // Clear cart
    await cartService.clearCart(userId);
    
    Alert.alert('Success', 'Order placed successfully!');
  }
};
```

---

## 8. Environment Variables (Production)

For production, use environment variables:

```bash
# .env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Then in your config:
```javascript
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  // ...
});
```

---

## 9. Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Load seed data
4. ✅ Configure React Native app
5. ✅ Test basic operations
6. 🔄 Implement authentication flow
7. 🔄 Build product listing screens
8. 🔄 Implement cart functionality
9. 🔄 Create checkout flow
10. 🔄 Add order tracking

---

## 10. Useful Supabase Dashboard Links

- **Table Editor**: View and edit data
- **SQL Editor**: Run custom queries
- **Authentication**: Manage users
- **Storage**: Upload product images
- **API Docs**: Auto-generated API documentation
- **Logs**: Debug errors

---

## 11. Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Native Guide**: https://reactnative.dev/docs/getting-started
- **Supabase Discord**: https://discord.supabase.com

---

## 🎉 You're All Set!

Your Supabase backend is now ready. Start building your e-commerce app!

**Need help?** Check the Common Issues section or refer to the usage examples.