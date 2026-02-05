import { X, DollarSign, Clock, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import api from '../../utils/api';

/**
 * BidModal Component
 * Shows up when a worker wants to apply for a shift
 * Let's them set their rate, arrival time, and message
 */
const BidModal = ({ shift, onClose, onSuccess }) => {

  // Store the form data
  const [formData, setFormData] = useState({
    bidAmount: shift?.pay?.min || 0, // Pre-fill with minimum budget
    estimatedArrivalTime: '',
    message: '',
  });

  // Track loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form when user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit the bid
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting bid for shift:', shift);
      console.log('Shift ID:', shift._id);
      console.log('Form data:', formData);

      // Simple validation
      if (!formData.bidAmount || !formData.estimatedArrivalTime) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.bidAmount <= 0) {
        throw new Error('Your rate must be greater than 0');
      }

      if (!shift._id) {
        throw new Error('Invalid shift ID');
      }

      // Send bid to backend
      const response = await api.post('/bids', {
        shiftId: shift._id,
        bidAmount: Number(formData.bidAmount),
        estimatedArrivalTime: formData.estimatedArrivalTime,
        message: formData.message,
      });

      console.log('Bid response:', response.data);

      if (response.data.success) {
        // Close modal and notify parent
        onSuccess(response.data.message);
        onClose();
      }
    } catch (err) {
      console.error('Bid error:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to place bid';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Dark overlay
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Modal content - stop clicks from closing */}
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#032A33]">Apply for Shift</h2>
              <p className="text-sm text-[#888888] mt-1">{shift.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-[#888888]" />
            </button>
          </div>
        </div>

        {/* Job Summary */}
        <div className="p-6 bg-[#E0F0F3]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#888888]">Category</p>
              <p className="font-semibold text-[#032A33]">{shift.category}</p>
            </div>
            <div>
              <p className="text-sm text-[#888888]">Budget Range</p>
              <p className="font-semibold text-[#032A33]">
                Rs. {shift.pay?.min} - {shift.pay?.max}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#888888]">Date</p>
              <p className="font-semibold text-[#032A33]">
                {new Date(shift.date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#888888]">Time</p>
              <p className="font-semibold text-[#032A33]">
                {shift.time?.start} - {shift.time?.end}
              </p>
            </div>
          </div>
        </div>

        {/* Bid Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Your Rate */}
          <div>
            <label className="block text-sm font-medium text-[#032A33] mb-2">
              Your Rate <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
              <input
                type="number"
                name="bidAmount"
                value={formData.bidAmount}
                onChange={handleChange}
                placeholder="Enter your rate"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                required
              />
            </div>
            <p className="text-xs text-[#888888] mt-1">
              Budget: Rs. {shift.pay?.min} - Rs. {shift.pay?.max}
            </p>
          </div>

          {/* When can you start? */}
          <div>
            <label className="block text-sm font-medium text-[#032A33] mb-2">
              When can you start? <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
              <input
                type="text"
                name="estimatedArrivalTime"
                value={formData.estimatedArrivalTime}
                onChange={handleChange}
                placeholder="e.g., Within 2 hours, Tomorrow morning"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Short Note */}
          <div>
            <label className="block text-sm font-medium text-[#032A33] mb-2">
              Short Note (Optional)
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-[#888888]" />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell the employer why you're a great fit..."
                rows="3"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B4B54] focus:border-transparent resize-none"
                maxLength="500"
              />
            </div>
            <p className="text-xs text-[#888888] mt-1">
              {formData.message.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#0B4B54] text-white rounded-lg hover:bg-[#032A33] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidModal;
