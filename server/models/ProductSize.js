import mongoose from 'mongoose';

const productSizeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productId: { type: String }, // String/UUID identifier for GraphQL/Firestore mapping
  label: { type: String, required: true }, // e.g. 'Small (5cm)'
  priceDelta: { type: Number, default: 0 }
}, {
  timestamps: true
});

productSizeSchema.index({ product: 1 });
productSizeSchema.index({ productId: 1 });

export const ProductSize = mongoose.models.ProductSize || mongoose.model('ProductSize', productSizeSchema);
export default ProductSize;
