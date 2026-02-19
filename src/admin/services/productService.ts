"use client";

import { supabase } from '../../supabase/supabase-config';

const TABLE = 'products';

const handleError = (error: any) => {
    if (error) {
        console.error("Supabase Error:", error);
        throw new Error(error.message);
    }
};

export async function getAdminProducts(categoryId: string | null = null) {
    let query = supabase
        .from(TABLE)
        .select('*')
        .order('created_at', { ascending: false });

    if (categoryId) query = query.eq('category_id', categoryId);

    const { data, error } = await query;
    handleError(error);
    return data ?? [];
}

export async function createAdminProduct(payload: any) {
    // Ensure we only send columns that exist in the database schema
    // and that data types are correct (e.g. price as number, category_id as UUID)
    const cleanData: any = {
        name_ar: payload.name_ar,
        name_en: payload.name_en || null,
        price: parseFloat(payload.price),
        unit: payload.unit || 'كيلو',
        description_ar: payload.description_ar || null,
        description_en: payload.description_en || null,
        subtitle_ar: payload.subtitle_ar || null, // New field
        image_url: payload.image_url || null,
        category_id: payload.category_id,
    };

    // Only add optional fields if they are present in the payload
    if (payload.stock_quantity !== undefined) cleanData.stock_quantity = parseInt(payload.stock_quantity);
    if (payload.discount_percentage !== undefined) cleanData.discount_percentage = parseInt(payload.discount_percentage);

    const { data, error } = await supabase
        .from(TABLE)
        .insert(cleanData)
        .select()
        .single();

    handleError(error);
    return data;
}

export async function updateAdminProduct(id: string, payload: any) {
    const cleanData: any = {
        name_ar: payload.name_ar,
        name_en: payload.name_en || null,
        price: parseFloat(payload.price),
        unit: payload.unit || 'كيلو',
        description_ar: payload.description_ar || null,
        description_en: payload.description_en || null,
        subtitle_ar: payload.subtitle_ar || null, // New field
        image_url: payload.image_url || null,
        category_id: payload.category_id
    };

    const { data, error } = await supabase
        .from(TABLE)
        .update(cleanData)
        .eq('id', id)
        .select()
        .single();

    handleError(error);
    return data;
}

export async function deleteAdminProduct(id: string) {
    const { error } = await (supabase.from(TABLE).delete().eq('id', id) as any);
    handleError(error);
}

export async function uploadProductImage(file: File) {
    try {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
        const filename = `${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filename, file, {
                upsert: false,
                contentType: file.type
            });

        if (uploadError) {
            throw new Error(`تعذر رفع الملف: ${uploadError.message}`);
        }

        const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(filename);

        return data.publicUrl;
    } catch (err: any) {
        throw err;
    }
}
