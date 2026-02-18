-- ==========================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ==========================================
-- This trigger automatically creates a user profile in the public.users table
-- when a new user signs up via Supabase Auth

-- First, drop the existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function that will be triggered
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert a new row into public.users with the same id as auth.users
  INSERT INTO public.users (id, email, full_name, phone_number)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '')
  );
  
  -- Also create a wallet for the new user
  INSERT INTO public.wallets (user_id, balance, currency)
  VALUES (NEW.id, 0.00, 'EGP');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger that fires after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- UPDATE USERS TABLE SCHEMA
-- ==========================================
-- Modify the users table to use auth.users id instead of generating its own

-- First, drop the existing constraint if it exists
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;

-- Make sure the id column references auth.users
-- Note: This assumes the table is empty or you've backed up your data
-- If you have existing data, you'll need to migrate it carefully

COMMENT ON TABLE public.users IS 'User profiles - automatically created when users sign up via Supabase Auth';
COMMENT ON COLUMN public.users.id IS 'References auth.users(id) - automatically set by trigger';
