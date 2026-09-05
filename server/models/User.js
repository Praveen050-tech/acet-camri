import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'club_lead', 'student', 'faculty'], 
    default: 'student' 
  },
  rollNo: { type: String, default: '' },
  department: { type: String, default: 'Computer Science and Engineering' },
  campus: { type: String, default: 'Kinathukadavu, Coimbatore' }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
