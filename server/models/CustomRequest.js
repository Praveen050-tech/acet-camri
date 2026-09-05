import mongoose from 'mongoose';

const customRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  studentName: { type: String, default: 'ACET Innovator' },
  contact: { type: String, required: true },
  rollNo: { type: String, default: '' },
  department: { type: String, default: 'Engineering' },
  fileName: { type: String, required: true },
  fileSize: { type: String, default: '14.2 MB' },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  material: { type: String, required: true },
  finish: { type: String, default: 'Studio Raw' },
  infillDensity: { type: Number, default: 25 },
  estimatedWeight: { type: String, default: '~180 grams' },
  estimatedPrintTime: { type: String, default: '~11 Hours' },
  estimatedPrice: { type: Number, required: true },
  specialInstructions: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Pending Slice Review', 'Approved & Slicing Bed Scheduled', 'In Production', 'Ready for Lab Pickup', 'Rejected'],
    default: 'Pending Slice Review'
  },
  assignedPrintBed: { type: String, default: 'Unassigned' }
}, {
  timestamps: true
});

export const CustomRequest = mongoose.models.CustomRequest || mongoose.model('CustomRequest', customRequestSchema);
