import { supabase } from '../supabase/supabase-config';

/**
 * Email Service for sending emails via secure Supabase Edge Functions.
 * This prevents leaking private API keys to the client.
 */
export const emailService = {
    /**
     * Calls a secure Supabase Edge Function to send emails.
     */
    invokeEmailFunction: async (type: string, payload: any) => {
        try {
            // This calls a Supabase Edge Function named 'send-email'
            // You must deploy this function to your Supabase project
            const { data, error } = await (supabase as any).functions.invoke('send-email', {
                body: { type, ...payload },
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error: any) {
            console.error('❌ Email service error:', error);
            return { success: false, error: error.message };
        }
    },

    sendWelcomeEmail: async (to: string, userName?: string) => {
        return emailService.invokeEmailFunction('welcome', { to, userName });
    },

    sendOrderConfirmation: async (
        to: string,
        orderDetails: {
            orderId: string;
            items: Array<{ name: string; quantity: number; price: number }>;
            total: number;
            deliveryAddress?: string;
        }
    ) => {
        return emailService.invokeEmailFunction('order-confirmation', { to, orderDetails });
    },

    sendCustomEmail: async (options: {
        to: string;
        subject: string;
        html: string;
        from?: string;
    }) => {
        return emailService.invokeEmailFunction('custom', options);
    },

    sendPasswordResetEmail: async (to: string, resetLink: string) => {
        return emailService.invokeEmailFunction('password-reset', { to, resetLink });
    },
};

export default emailService;