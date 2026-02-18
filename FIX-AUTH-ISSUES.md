# 🔧 Fix Sign Up / Sign In Issues

## Problem
When users try to sign up or sign in, they get an error. This is because the `users` table is not automatically populated when someone signs up via Supabase Auth.

## Solution
We need to create a database trigger that automatically creates a user profile when someone signs up.

## Steps to Fix

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/qjzpjleztbqauxxjvnqr
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the Auth Trigger SQL
Copy and paste the entire content of `auth-trigger.sql` into the SQL editor and click **Run**.

This will:
- Create a trigger function that runs whenever a new user signs up
- Automatically create a profile in the `users` table
- Automatically create a wallet for the new user

### Step 3: Update the Users Table Schema
The `users` table needs to be modified to properly reference `auth.users`:

```sql
-- Make sure the users table id column doesn't auto-generate UUIDs
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;

-- Add a foreign key constraint (optional but recommended)
-- Note: Only run this if your table is empty or you've migrated existing data
-- ALTER TABLE public.users ADD CONSTRAINT users_id_fkey 
--   FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

### Step 4: Test the Fix
1. Try signing up with a new email address
2. Check the `users` table to see if a profile was created
3. Check the `wallets` table to see if a wallet was created

## Alternative: Manual User Creation (If Trigger Doesn't Work)

If the trigger approach doesn't work, you can modify the signup function to manually create the user profile:

### Update `supabase-hooks.ts`

Replace the `signUp` function (around line 62) with:

```typescript
const signUp = async (email: string, password: string, userData: { full_name: string; phone_number?: string }) => {
  // Step 1: Sign up the user via Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: userData }
  });

  if (error) return { data, error };

  // Step 2: If signup successful, create user profile manually
  if (data.user) {
    try {
      // Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: userData.full_name,
          phone_number: userData.phone_number || ''
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
      }

      // Create wallet
      const { error: walletError } = await supabase
        .from('wallets')
        .insert({
          user_id: data.user.id,
          balance: 0.00,
          currency: 'EGP'
        });

      if (walletError) {
        console.error('Error creating wallet:', walletError);
      }
    } catch (err) {
      console.error('Error in post-signup setup:', err);
    }
  }

  return { data, error };
};
```

## Verification

After implementing the fix, verify it works by:

1. **Sign Up Test**:
   - Go to `/signup`
   - Create a new account
   - Check if you're redirected to `/first-time-login`

2. **Database Check**:
   - Open Supabase Dashboard
   - Go to **Table Editor**
   - Check `users` table - should have a new row
   - Check `wallets` table - should have a new wallet

3. **Sign In Test**:
   - Sign out
   - Go to `/login`
   - Sign in with the account you just created
   - Should redirect to home page

## Common Issues

### Issue 1: "User already exists"
- **Solution**: The auth user was created but the profile wasn't. Delete the auth user from Authentication > Users and try again.

### Issue 2: "Foreign key violation"
- **Solution**: Make sure the `users` table id column doesn't have a DEFAULT value that generates UUIDs.

### Issue 3: "Permission denied"
- **Solution**: Make sure RLS (Row Level Security) policies allow inserting into `users` and `wallets` tables.

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Check the Supabase logs in Dashboard > Logs
3. Verify your environment variables in `.env` are correct
