import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    // token stored for admin-level access validation (manually seeded and overwritten on login)
    token: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
    phone: {
      type: String,
      default: null,
    },

    profileImage: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// password hash
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// password match
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
