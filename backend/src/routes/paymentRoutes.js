import crypto from 'crypto';
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import Payment from '../models/Payment.js';
import Shift from '../models/shift.js';

const router = express.Router();

const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q'; // eSewa test secret key
const ESEWA_MERCHANT_CODE = process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST';

// POST /api/payments/esewa/initiate
// Generates the HMAC-SHA256 signature required by eSewa v2 API
router.post('/esewa/initiate', protect, async (req, res) => {
    try {
        const { shiftId, amount, workerId } = req.body;

        if (!shiftId || !amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid payment details' });
        }

        const transactionUuid = `NEPSHIFT-${shiftId}-${Date.now()}`;
        const totalAmount = Number(amount);

        // Check if shift is already paid
        const shift = await Shift.findById(shiftId);
        if (!shift) return res.status(404).json({ success: false, message: 'Shift not found' });
        if (shift.isPaid) return res.status(400).json({ success: false, message: 'This shift has already been paid' });

        // Save pending payment record in DB
        await Payment.create({
            shiftId,
            hirerId: req.user._id,
            workerId,
            amount: totalAmount,
            transactionUuid,
            status: 'pending',
        });

        // eSewa v2 signature: HMAC-SHA256 of "total_amount=X,transaction_uuid=Y,product_code=Z"
        const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${ESEWA_MERCHANT_CODE}`;
        const signature = crypto
            .createHmac('sha256', ESEWA_SECRET_KEY)
            .update(message)
            .digest('base64');

        res.json({
            success: true,
            data: {
                transactionUuid,
                signature,
                merchantCode: ESEWA_MERCHANT_CODE,
                amount: totalAmount,
            },
        });
    } catch (error) {
        console.error('eSewa initiate error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/payments/esewa/verify
// Verifies the payment response that eSewa sends back after payment
router.post('/esewa/verify', protect, async (req, res) => {
    try {
        const { data } = req.body; // Base64 encoded JSON from eSewa success redirect

        if (!data) {
            return res.status(400).json({ success: false, message: 'No payment data received' });
        }

        // Decode the base64 response from eSewa
        const decoded = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));

        // Verify signature
        const signedFields = decoded.signed_field_names?.split(',') || [];
        const message = signedFields.map(field => `${field}=${decoded[field]}`).join(',');
        const expectedSignature = crypto
            .createHmac('sha256', ESEWA_SECRET_KEY)
            .update(message)
            .digest('base64');

        if (expectedSignature !== decoded.signature) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        if (decoded.status !== 'COMPLETE') {
            return res.status(400).json({ success: false, message: 'Payment not completed' });
        }

        // Find and update the payment record
        const payment = await Payment.findOne({ transactionUuid: decoded.transaction_uuid });
        if (!payment) return res.status(404).json({ success: false, message: 'Payment record not found' });

        // Prevent double-processing
        if (payment.status === 'completed') {
            return res.json({ success: true, message: 'Already verified', transactionCode: payment.esewaTransactionCode, amount: payment.amount });
        }

        const paidAt = new Date();
        payment.status = 'completed';
        payment.esewaTransactionCode = decoded.transaction_code;
        payment.paidAt = paidAt;
        await payment.save();

        // Mark shift as paid
        await Shift.findByIdAndUpdate(payment.shiftId, {
            isPaid: true,
            paidAmount: payment.amount,
            paymentTransactionId: decoded.transaction_code,
            paidAt,
        });

        return res.json({
            success: true,
            message: 'Payment verified successfully',
            transactionCode: decoded.transaction_code,
            amount: payment.amount,
        });
    } catch (error) {
        console.error('eSewa verify error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/payments/shift/:shiftId
// Returns completed payment info for a shift (used by hirer ShiftDetails)
router.get('/shift/:shiftId', protect, async (req, res) => {
    try {
        const payment = await Payment.findOne({ shiftId: req.params.shiftId, status: 'completed' })
            .populate('workerId', 'fullName');

        if (!payment) return res.json({ success: true, isPaid: false });

        res.json({
            success: true,
            isPaid: true,
            amount: payment.amount,
            transactionCode: payment.esewaTransactionCode,
            paidAt: payment.paidAt,
            workerName: payment.workerId?.fullName,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/payments/my-transactions
// Returns real eSewa payment history for the logged-in worker's Wallet page
router.get('/my-transactions', protect, async (req, res) => {
    try {
        const payments = await Payment.find({ workerId: req.user._id, status: 'completed' })
            .populate('shiftId', 'title category')
            .populate('hirerId', 'fullName')
            .sort({ paidAt: -1 });

        const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const thisMonth = payments
            .filter(p => new Date(p.paidAt) >= startOfMonth)
            .reduce((sum, p) => sum + p.amount, 0);

        const transactions = payments.map(p => ({
            id: p._id,
            shiftId: p.shiftId?._id?.toString(),
            title: `${p.shiftId?.title || 'Shift'} — ${p.hirerId?.fullName || 'Employer'}`,
            category: p.shiftId?.category || '',
            amount: p.amount,
            transactionCode: p.esewaTransactionCode,
            paidAt: p.paidAt,
            type: 'credit',
            date: new Date(p.paidAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'completed',
        }));

        res.json({ success: true, data: { transactions, totalEarnings, thisMonth } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
