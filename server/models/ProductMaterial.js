import mongoose from 'mongoose';

const productMaterialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productId: { type: String }, // String/UUID identifier for GraphQL/Firestore mapping
  name: { type: String, required: true }, // e.g. 'PLA', 'Resin', 'PETG'
  priceDelta: { type: Number, default: 0 }
}, {
  timestamps: true
});

productMaterialSchema.index({ product: 1 });
productMaterialSchema.index({ productId: 1 });

export const ProductMaterial = mongoose.models.ProductMaterial || mongoose.model('ProductMaterial', productMaterialSchema);
export default ProductMaterial;
