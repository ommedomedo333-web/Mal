import productsData from '../data/products.json';
import categoriesData from '../data/categories.json';
import { Zap, Star, Leaf, Clock, MapPin, ShieldCheck, Crown, Brain, Utensils, Smartphone, Apple, Milk, Flame, Sprout, CupSoda, Cookie, Package, Snowflake, Droplets } from 'lucide-react';
import React from 'react';

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  image_url?: string;
}

export interface Product {
  id: string;
  category: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar: string;
  price: number;
  old_price?: number;
  unit: string;
  images: string[];
  rating: number;
  is_in_stock: boolean;
  discount_percent?: number;
  reviews_count?: number;
  origin_ar?: string;
  origin_en?: string;
  weight?: string;
}

export const getProductsByCategory = (categoryIdOrName: string): Product[] => {
  // البحث عن المنتجات التي تطابق المعرف أو اسم القسم (عربي أو إنجليزي)
  return (productsData.products as any[]).filter(p =>
    p.category === categoryIdOrName ||
    p.category_id === categoryIdOrName
  );
  return (productsData.products as any[]).filter(p =>
    p.category === categoryIdOrName ||
    p.category_id === categoryIdOrName
  );
};

export const getAllProducts = () => productsData.products as any[];

export const getAllCategories = () => categoriesData.categories;

export const getFeaturedOffers = () => {
  return (productsData.products as any[]).slice(0, 4);
};

export const getIconComponent = (category: any) => {
  const iconMap: { [key: string]: any } = {
    'خضروات': Sprout,
    'ورقيات': Leaf,
    'فواكه': Apple,
    'تمور': Package,
    'عسل': Milk,
    'مكسرات & ياميش': Sprout,
    'عصاير': CupSoda,
    'مجمدات': Snowflake,
    'البان': Milk,
  };

  const Icon = iconMap[category.name_ar] || iconMap[category.id] || Zap;
  return Icon;
};