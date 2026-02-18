import { supabase } from '../supabase/supabase-config';

const ADMIN_EMAIL = 'omm651571@gmail.com';
const ADMIN_PANEL_URL = 'https://atyab.netlify.app/admin';

/**
 * Send order notification email to admin
 * @param {Object} orderData - Order details
 * @param {Array} items - Order items with product details
 * @returns {Promise<Object>} - Result of email send operation
 */
export const sendOrderNotificationToAdmin = async (orderData, items) => {
  try {
    console.log('🔔 Triggering order notification edge function...');

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('send-order-email', {
      body: { orderData, items }
    });

    if (error) {
      console.error('❌ Edge function error:', error);
      // Fallback to EmailJS logic if Edge Function fails? 
      // For now, let's just log it.
      return { success: false, error: error.message };
    }

    console.log('✅ Edge function response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending order notification email:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendOrderNotificationToAdmin
};
