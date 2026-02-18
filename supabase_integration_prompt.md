# Professional Supabase Integration Prompt for Fresh Market App

## Project Overview
I have a React-based Arabic marketplace application for fresh fruits and vegetables with a digital wallet system. I need to integrate Supabase as the backend database with a complete, production-ready implementation.

## Application Features (Based on Screenshots)
1. **Home Page**: Hero section with fresh produce imagery
2. **Digital Wallet**: Balance display (150 EGP), charge and payment request functionality
3. **Main Sections Dashboard**: 
   - Recently Arrived (وصل حديثنا)
   - Local Products (منتجات محلية)
   - Organic (عضوي)
   - Delivery Boxes (صناديق التوفير)
   - Supplements & Nuts (مكسرات وبذور)
   - Milk & Cheese (ألبان وجبن)
   - Intelligence Tests (اختبارات الذكاء)
   - Mobile Application (حمِّل التطبيق)
4. **Fresh Fruits Section**: Product cards with images, ratings, prices, and quantity controls
5. **Orders Management**: Order history with status tracking (Delivered, Pending)
6. **Offers Section**: Special deals with discount badges
7. **User Authentication**: Login/Registration system

## Required Supabase Implementation

### 1. Database Schema Design

Create the following tables with proper relationships:

#### **users** table
```sql
- id (uuid, primary key, default: gen_random_uuid())
- email (text, unique, not null)
- full_name (text)
- phone_number (text)
- created_at (timestamp with time zone, default: now())
- updated_at (timestamp with time zone, default: now())
- avatar_url (text)
- address_line1 (text)
- address_line2 (text)
- city (text)
- postal_code (text)
```

#### **wallets** table
```sql
- id (uuid, primary key, default: gen_random_uuid())
- user_id (uuid, foreign key -> users.id, unique)
- balance (decimal(10,2), default: 0.00)
- currency (text, default: 'EGP')
- created_at (timestamp with time zone, default: now())
- updated_at (timestamp with time zone, default: now())
```

#### **wallet_transactions** table
```sql
- id (uuid, primary key, default: gen_random_uuid())
- wallet_id (uuid, foreign key -> wallets.id)
- transaction_type (text) -- 'charge', 'payment', 'refund', 'transfer'
- amount (decimal(10,2), not null)
- status (text) -- 'pending', 'completed', 'failed'
- description (text)
- reference_id (text)
- created_at (timestamp with time zone, default: now())
```

#### **categories** table
```sql
- id (uuid, primary key, default: gen_random_uuid())
- name_ar (text, not null)
- name_en (text)
- icon_name (text)
- display_order (integer)
- is_active (boolean, default: true)
- created_at (timestamp with time zone, default: now())
```

#### **products** table
```sql
- id (uuid, primary key, default: gen_random_uuid())
- category_id (uuid, foreign key -> categories.id)
- name_ar (text, not null)
- name_en (text)
- description_ar (text)
- description_en (text)
- price (decimal(10,2), not null)
- original_price (decimal(10,2)) -- for discounts
- discount_percentage (integer)
- unit (text) -- 'kg', 'piece', 'gram'
- stock_quantity (integer, default: 0)
- image_url (text)
- rating (decimal(2,1), default: 0.0)
- total_reviews (integer, default: 0)
- is_featured (boolean, default: false)
- is_organic (boolean, default: false)
- is_local (boolean, default: false)
- created_at (timestamp with time zone, default: now())
- updated_at (timestamp with time zone, default: now())
```

#### **orders** table
```sql
- id (uuid, primary key, default: gen_random_uuid())
- order_number (text, unique, not null)
- user_id (uuid, foreign key -> users.id)
- total_amount (decimal(10,2), not null)
- status (text) -- 'pending', 'confirmed', 'processing', 'delivered', 'cancelled'
- payment_method (text) -- 'wallet', 'cash', 'card'
- delivery_address (jsonb)
- delivery_date (timestamp with time zone)
- notes (text)
- created_at (timestamp with time zone, default: now())
- updated_at (timestamp with time zone, default: now())
```

#### **order_items** table
```sql
- id (uuid, primary key, default: gen_random_uuid())
- order_id (uuid, foreign key -> orders.id, on delete cascade)
- product_id (uuid, foreign key -> products.id)
- quantity (integer, not null)
- unit_price (decimal(10,2), not null)
- subtotal (decimal(10,2), not null)
- created_at (timestamp with time zone, default: now())
```

#### **offers** table
```sql
- id (uuid, primary key, default: gen_random_uuid())
- title_ar (text, not null)
- title_en (text)
- description_ar (text)
- description_en (text)
- discount_type (text) -- 'percentage', 'fixed'
- discount_value (decimal(10,2))
- product_ids (uuid[]) -- array of product IDs
- start_date (timestamp with time zone)
- end_date (timestamp with time zone)
- is_active (boolean, default: true)
- created_at (timestamp with time zone, default: now())
```

#### **cart** table
```sql
- id (uuid, primary key, default: gen_random_uuid())
- user_id (uuid, foreign key -> users.id)
- product_id (uuid, foreign key -> products.id)
- quantity (integer, not null)
- created_at (timestamp with time zone, default: now())
- updated_at (timestamp with time zone, default: now())
```

### 2. Row Level Security (RLS) Policies

Implement RLS for all tables:

#### Users table policies:
- Users can read their own data
- Users can update their own data
- Admin can read/update all users

#### Wallets table policies:
- Users can read their own wallet
- System can update wallet (through stored procedures)

#### Products table policies:
- Everyone can read products
- Admin can create/update/delete products

#### Orders table policies:
- Users can read their own orders
- Users can create orders
- Admin can read/update all orders

### 3. Database Functions & Triggers

Create the following Postgres functions:

#### **process_wallet_charge()**
```sql
-- Function to safely charge wallet and create transaction record
-- Parameters: user_id, amount
-- Returns: transaction_id
```

#### **process_wallet_payment()**
```sql
-- Function to process payment from wallet
-- Parameters: user_id, order_id, amount
-- Returns: success boolean
-- Should check balance and create transaction
```

#### **update_product_rating()**
```sql
-- Trigger function to update product rating when review is added
```

#### **generate_order_number()**
```sql
-- Function to generate unique order number
-- Format: #1001, #1002, etc.
```

#### **update_stock_on_order()**
```sql
-- Trigger to update product stock when order is placed
```

### 4. React Integration Requirements

Please provide complete implementation for:

#### **Supabase Client Setup**
- Environment variable configuration
- Client initialization
- Type-safe database types generation

#### **Authentication Hooks**
```typescript
- useAuth() -- Authentication state management
- useUser() -- Current user data
- signUp(email, password, userData)
- signIn(email, password)
- signOut()
- resetPassword(email)
```

#### **Wallet Hooks**
```typescript
- useWallet() -- Get wallet balance and transactions
- chargeWallet(amount) -- Add funds
- processPayment(orderId, amount) -- Deduct funds
- getTransactionHistory() -- Fetch all transactions
```

#### **Product Hooks**
```typescript
- useProducts(filters) -- Get products with filters
- useProduct(id) -- Get single product
- useProductsByCategory(categoryId)
- useFeaturedProducts()
- useOffers()
```

#### **Order Hooks**
```typescript
- useOrders() -- Get user orders
- useOrder(id) -- Get single order
- createOrder(orderData)
- updateOrderStatus(orderId, status)
```

#### **Cart Hooks**
```typescript
- useCart() -- Get cart items
- addToCart(productId, quantity)
- updateCartItem(itemId, quantity)
- removeFromCart(itemId)
- clearCart()
```

### 5. Real-time Subscriptions

Implement real-time updates for:
- Wallet balance changes
- Order status updates
- Product stock updates
- Cart changes (if multi-device support needed)

### 6. Storage Buckets

Configure Supabase Storage for:
- **products**: Product images (public bucket)
- **users**: User avatars (private bucket)
- **categories**: Category icons (public bucket)

With proper upload, delete, and URL generation functions.

### 7. Error Handling & Validation

Implement:
- Comprehensive error handling for all database operations
- Zod or Yup schemas for data validation
- Custom error messages in Arabic
- Loading states for all async operations
- Optimistic updates where appropriate

### 8. Performance Optimization

Include:
- Database indexes on frequently queried columns
- Query optimization with proper select statements
- Pagination for large datasets
- Caching strategies using React Query or SWR
- Image optimization with Supabase transformations

### 9. Security Considerations

Ensure:
- All sensitive operations use database functions
- No direct client-side manipulation of critical data (balance, prices)
- Input sanitization
- Rate limiting for wallet operations
- Audit logging for financial transactions

### 10. Seed Data

Provide seed data scripts for:
- Sample categories (8 categories shown in app)
- Sample products (at least 20 products with Arabic names)
- Sample offers with discount badges
- Test user accounts

## Expected Deliverables

1. Complete SQL migration files for database setup
2. Supabase client configuration file
3. TypeScript types file generated from database schema
4. All custom hooks with full TypeScript support
5. Context providers for Auth, Cart, and Wallet
6. Sample .env.example file
7. README with setup instructions
8. API documentation for all functions

## Technical Stack
- React 18+ with TypeScript
- Supabase (latest version)
- React Query or SWR for data fetching
- Tailwind CSS (based on UI design)
- React Router for navigation
- Zod/Yup for validation

## Code Quality Requirements
- Full TypeScript coverage
- ESLint + Prettier configuration
- Component composition following React best practices
- Custom hooks for reusable logic
- Proper error boundaries
- Loading skeletons for better UX
- Responsive design for mobile/tablet/desktop

Please provide a complete, production-ready implementation that I can directly integrate into my existing React application.
