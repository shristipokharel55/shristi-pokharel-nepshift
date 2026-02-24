import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    // The shift this payment is for
    shiftId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shift',
        required: true,
    },
    // Hirer who is sending the payment
    hirerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Worker who receives the payment
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Amount paid
    amount: {
        type: Number,
        required: true,
        min: 1,
    },
    // eSewa transaction UUID generated at initiation
    transactionUuid: {
        type: String,
        required: true,
        unique: true,
    },
    // eSewa transaction code returned after successful payment
    esewaTransactionCode: {
        type: String,
        default: null,
    },
    // Payment status
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    // When the payment was completed
    paidAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

PaymentSchema.index({ shiftId: 1 });
PaymentSchema.index({ workerId: 1, status: 1 });
PaymentSchema.index({ hirerId: 1, status: 1 });
PaymentSchema.index({ transactionUuid: 1 });

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
