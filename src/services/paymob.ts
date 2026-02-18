import { supabase } from '../supabase/supabase-config';

// Types
export interface PaymobIntentResponse {
    success: boolean;
    clientSecret?: string;
    intentId?: string;
    checkoutUrl?: string;
    error?: string;
}

export const paymobService = {
    /**
     * Creates a payment intent via Supabase Edge Function to keep keys secure.
     */
    createIntent: async (
        amount: number,
        orderId?: string,
        customerData?: {
            full_name?: string;
            email?: string;
            phone_number?: string;
        }
    ): Promise<PaymobIntentResponse> => {
        try {
            // SECURE APPROACH: Call a Supabase Edge Function
            // This prevents leaking your Paymob Secret Key to the browser.
            const { data, error } = await (supabase as any).functions.invoke('paymob-intent', {
                body: {
                    amount,
                    orderId,
                    customerData
                },
            });

            if (error) throw error;

            return {
                success: true,
                checkoutUrl: data.checkoutUrl,
                intentId: data.intentId,
            };
        } catch (error: any) {
            console.error('Paymob Error Details:', error);
            return { success: false, error: error.message || 'Unknown Error' };
        }
    }
};

export default paymobService;