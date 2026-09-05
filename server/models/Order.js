import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  contact: { type: String, required: true },
  rollNo: { type: String, default: 'General / Alumni' },
  department: { type: String, default: 'General' },
  items: [{
    productId: String,
    title: String,
    material: String,
    size: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, required: true },
  fulfillment: { 
    type: String, 
    default: 'Campus Pickup (Kinathukadavu 3D Lab Desk)' 
  },
  address: { type: String, default: 'Kinathukadavu, Coimbatore' },
  paymentMethod: { 
    type: String, 
    default: 'Razorpay / UPI' 
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Pay on Pickup', 'pending', 'paid', 'failed'],
    default: 'Paid'
  },
  razorpayPaymentId: { type: String, default: '' },
  status: { 
    type: String, 
    enum: [
      'Placed', 'Confirmed', 'Printing', 'Shipped', 'Ready for Pickup', 'Delivered',
      'Order Placed & Mesh Audit', 'Placed & Mesh Audit in Progress', 
      'Slicing & Toolpath Gen', 'Printing on Bed', 'Printing on Bed 02', 
      'UV Curing & QC', 'Ready for Campus Pickup'
    ],
    default: 'Placed & Mesh Audit in Progress' 
  },
  printBed: { type: String, default: 'Bed 02 (Kinathukadavu SLA Hub)' },
  progressPercent: { type: Number, default: 20 },
  milestones: [{
    step: String,
    done: Boolean,
    time: String
  }]
}, {
  timestamps: true
});

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
