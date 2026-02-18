// aiProductService.ts
import { supabase } from '../supabase/supabase-config';

// Fetch and format product data from Supabase
export const fetchProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    // Format data as necessary
    return data.map(product => ({
        id: product.id,
        name: product.name_ar || product.name_en,
        price: parseFloat(product.price),
        description: product.description_ar || product.description_en,
    }));
};