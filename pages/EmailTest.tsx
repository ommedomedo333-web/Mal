import React, { useState } from 'react';
import { Mail, Send, CheckCircle, XCircle, Loader } from 'lucide-react';
import emailService from '../src/services/emailService';
import toast from 'react-hot-toast';

const EmailTest: React.FC = () => {
    const [email, setEmail] = useState('ommedomedo333@gmail.com');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

    const sendTestEmail = async () => {
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await emailService.sendWelcomeEmail(email, 'عميل جديد');

            if (response.success) {
                setResult({ success: true, message: 'Email request sent successfully! ✅' });
                toast.success('Email request sent!');
            } else {
                setResult({ success: false, message: `Failed: ${response.error}` });
                toast.error('Failed to send email');
            }
        } catch (error: any) {
            setResult({ success: false, message: `Error: ${error.message}` });
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const sendOrderConfirmation = async () => {
        if (!email || !email.includes('@')) {
            toast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await emailService.sendOrderConfirmation(email, {
                orderId: 'ORD-' + Date.now(),
                items: [
                    { name: 'تفاح أحمر', quantity: 2, price: 25 },
                    { name: 'موز', quantity: 1, price: 15 },
                    { name: 'برتقال', quantity: 3, price: 30 },
                ],
                total: 70,
                deliveryAddress: 'القاهرة، مصر الجديدة، شارع النزهة',
            });

            if (response.success) {
                setResult({ success: true, message: 'Order confirmation request sent! ✅' });
                toast.success('Order confirmation sent!');
            } else {
                setResult({ success: false, message: `Failed: ${response.error}` });
                toast.error('Failed to send email');
            }
        } catch (error: any) {
            setResult({ success: false, message: `Error: ${error.message}` });
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-32 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                            <Mail size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Email Testing</h1>
                            <p className="text-gray-500">Test secure email integration</p>
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recipient Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={sendTestEmail}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                        >
                            {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                            Send Welcome Email
                        </button>

                        <button
                            onClick={sendOrderConfirmation}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50"
                        >
                            {loading ? <Loader size={20} className="animate-spin" /> : <Mail size={20} />}
                            Send Order Confirmation
                        </button>
                    </div>

                    {/* Result Display */}
                    {result && (
                        <div className={`p-4 rounded-lg flex items-start gap-3 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                            {result.success ? <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />}
                            <div>
                                <p className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>{result.success ? 'Success!' : 'Error'}</p>
                                <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-600'}`}>{result.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">🛡️ Security Note:</h3>
                        <p className="text-sm text-blue-700">
                            API keys have been removed from the frontend. Requests are now handled securely via Supabase Edge Functions.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailTest;