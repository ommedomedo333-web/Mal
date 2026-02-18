import { useState, useEffect, useCallback } from 'react';
import {
    getAdminProducts,
    createAdminProduct,
    updateAdminProduct,
    deleteAdminProduct,
} from '../services/productService';

export function useAdminProducts(categoryId: string | null = null) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getAdminProducts(categoryId);
            setProducts(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const addProduct = async (payload: any) => {
        try {
            const newItem = await createAdminProduct(payload);
            setProducts((prev) => [newItem, ...prev]);
            return newItem;
        } catch (err: any) {
            console.error("Add Product Error:", err);
            throw err; // Re-throw to be caught by the component
        }
    };

    const editProduct = async (id: string, payload: any) => {
        try {
            const updated = await updateAdminProduct(id, payload);
            setProducts((prev) =>
                prev.map((p) => (p.id === id ? updated : p))
            );
            return updated;
        } catch (err: any) {
            console.error("Edit Product Error:", err);
            throw err;
        }
    };

    const removeProduct = async (id: string) => {
        try {
            await deleteAdminProduct(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err: any) {
            console.error("Delete Product Error:", err);
            throw err;
        }
    };

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
        addProduct,
        editProduct,
        removeProduct,
    };
}
