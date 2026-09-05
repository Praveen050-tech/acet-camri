import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productId: { type: String }, // String/UUID identifier for GraphQL/Firestore mapping
  url: { type: String, required: true },
  position: { type: Number, default: 0 }
}, {
  timestamps: true
});

productImageSchema.index({ product: 1, position: 1 });
productImageSchema.index({ productId: 1 });

export const ProductImage = mongoose.models.ProductImage || mongoose.model('ProductImage', productImageSchema);
export default ProductImage;
