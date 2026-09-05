import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  author: { type: String, required: true },
  role: { type: String, default: 'ACET Student' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
