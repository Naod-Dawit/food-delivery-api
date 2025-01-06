import mongoose from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // User's full name
  email: { type: String, required: true, unique: true }, // Unique email
  password: { type: String, required: true }, // Hashed password
  role: { type: String, default: 'customer' }, // Either 'customer' or 'admin'
  createdAt: { type: Date, default: Date.now }, // Auto-generated timestamp
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare entered password with stored password
userSchema.methods.comparePassword = async function (password:any) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
