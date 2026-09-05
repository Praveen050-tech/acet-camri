import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Figurines & Collectibles',
      'Home & Desk Décor',
      'CSE Academic Models',
      'Keychains & Small Gifts',
      'Custom Prints',
      'Event & Fest Merchandise',
      // Legacy/Alias categories supported gracefully
      'College Merch',
      'Engineering Models',
      'Spiritual Figurines',
      'Home Décor',
      'Fest Merch',
      'Alumni Gifting'
    ]
  },
  basePrice: { type: Number, required: true },
  salePrice: { type: Number, default: null },
  stockQuantity: { type: Number, required: true, default: 25 },
  printTimeHours: { type: Number, default: 2.0 },
  weightGrams: { type: Number, default: 50.0 },
  careInstructions: { type: String, default: 'Keep away from direct heat exceeding 55°C.' },
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Relational Virtuals pointing to separate tables
productSchema.virtual('images', {
  ref: 'ProductImage',
  localField: '_id',
  foreignField: 'product'
});

productSchema.virtual('materials', {
  ref: 'ProductMaterial',
  localField: '_id',
  foreignField: 'product'
});

productSchema.virtual('sizes', {
  ref: 'ProductSize',
  localField: '_id',
  foreignField: 'product'
});

// Storefront backward compatibility aliases
productSchema.virtual('title').get(function() {
  return this.name;
});

productSchema.virtual('price').get(function() {
  return this.salePrice || this.basePrice;
});

productSchema.virtual('regularPrice').get(function() {
  return this.basePrice;
});

productSchema.virtual('stock').get(function() {
  return this.stockQuantity;
});

productSchema.virtual('rating').get(function() {
  return this.ratingAvg;
});

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
