import { LucideIcon } from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  badge?: number;
}

export interface WalletPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  idealFor: string;
}

export interface ProductOffer {
  name: string;
  price: number;
  unit: string;
}