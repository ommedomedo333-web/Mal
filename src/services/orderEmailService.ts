// src/services/orderEmailService.ts
// ──────────────────────────────────────────────────────────────────────────────
// Sends order notification to admin (omm651571@gmail.com) via Supabase Edge Fn
// Call this right after a successful order is placed in Orders.tsx
// ──────────────────────────────────────────────────────────────────────────────

import { supabase } from '../supabase/supabase-config';

export interface OrderEmailPayload {
  orderId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  items: {
    name_ar?: string;
    name?: string;
    price: number;
    qty?: number;
    quantity?: number;
    unit?: string;
  }[];
  total: number;
  deliveryFee?: number;
  grandTotal: number;
  deliveryAddress?: string;
  paymentMethod?: string; // 'cash' | 'wallet' | 'card' | 'fawry'
  notes?: string;
  orderDate?: string;
}

export interface EmailResult {
  success: boolean;
  emailId?: string;
  sentTo?: string;
  error?: string;
}

// ─── Main Service ─────────────────────────────────────────────────────────────

const orderEmailService = {
  /**
   * Sends a full order notification to the admin Gmail (omm651571@gmail.com).
   * Includes all order details + direct link to Admin Panel.
   */
  async sendOrderToAdmin(payload: OrderEmailPayload): Promise<EmailResult> {
    try {
      // Format order date in Arabic
      const orderDate = new Date().toLocaleString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const { data, error } = await supabase.functions.invoke('send-order-email', {
        body: {
          ...payload,
          deliveryFee: payload.deliveryFee ?? 5,
          orderDate,
        },
      });

      if (error) {
        console.error('❌ orderEmailService error:', error.message);
        return { success: false, error: error.message };
      }

      if (data?.error) {
        console.error('❌ Edge function error:', data.error);
        return { success: false, error: data.error };
      }

      console.log(`✅ Order email sent! ID: ${data?.emailId}`);
      return {
        success: true,
        emailId: data?.emailId,
        sentTo: data?.sentTo,
      };
    } catch (err: any) {
      console.error('❌ Unexpected error sending order email:', err.message);
      return { success: false, error: err.message };
    }
  },
};

export default orderEmailService;
