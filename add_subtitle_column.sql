-- Run this in your Supabase SQL Editor to add the new field
ALTER TABLE public.products 
ADD COLUMN subtitle_ar TEXT;

-- Update the schema comment
COMMENT ON COLUMN public.products.subtitle_ar IS 'Initial short description shown next to the product title';
