import { CheckCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../utils/api';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);

    useEffect(() => {
        const verifyPayment = async () => {
            const data = searchParams.get('data');
            if (!data) {
                setVerifying(false);
                return;
            }
            try {
                const response = await api.post('/payments/esewa/verify', { data });
                if (response.data.success) {
                    setVerified(true);
                    setPaymentInfo(response.data);
                }
            } catch (error) {
                console.error('Payment verification failed:', error);
            } finally {
                setVerifying(false);
            }
        };
        verifyPayment();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
                {verifying ? (
                    <>
                        <Loader2 className="w-16 h-16 animate-spin text-[#0B4B54] mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">Verifying your payment...</p>
                    </>
                ) : verified ? (
                    <>
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} className="text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#032A33] mb-2">Payment Successful!</h2>
                        <p className="text-gray-600 mb-2">Worker has been paid successfully via eSewa.</p>
                        {paymentInfo?.amount && (
                            <p className="text-xl font-bold text-[#0B4B54] mb-6">
                                Rs {Number(paymentInfo.amount).toLocaleString()}
                            </p>
                        )}
                        {paymentInfo?.transactionCode && (
                            <p className="text-xs text-gray-400 mb-6">
                                Txn: {paymentInfo.transactionCode}
                            </p>
                        )}
                        <button
                            onClick={() => navigate('/hirer/manage-jobs')}
                            className="w-full px-6 py-3 bg-[#0B4B54] text-white rounded-xl hover:bg-[#0D5A65] font-semibold transition-colors"
                        >
                            Back to Jobs
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={48} className="text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#032A33] mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-6">We couldn't verify your payment. Please contact support.</p>
                        <button
                            onClick={() => navigate('/hirer/manage-jobs')}
                            className="w-full px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 font-semibold transition-colors"
                        >
                            Back to Jobs
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
