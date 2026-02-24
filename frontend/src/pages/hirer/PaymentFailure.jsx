import { XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <XCircle size={48} className="text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-[#032A33] mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-8">
                    Something went wrong with your eSewa payment. No money has been deducted. Please try again.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full px-6 py-3 bg-[#0B4B54] text-white rounded-xl hover:bg-[#0D5A65] font-semibold transition-colors"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => navigate('/hirer/manage-jobs')}
                        className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
