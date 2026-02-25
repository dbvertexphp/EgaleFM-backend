// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs'; // Password hashing ke liye zaroori hai

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     email: {
//       type: String,
//       trim: true,
//       lowercase: true,
//       unique: true,
//       sparse: true,
//       default: null,
//     },

//     profileImage: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     // userModel.js mein mobile field ko is tarah update karein
//     mobile: {
//       type: String,
//       trim: true,
//       unique: true, // Login ke liye unique hona zaroori hai
//       sparse: true, // Taaki null values par error na aaye
//       default: null,
//     },

//     address: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     countryId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Country',
//       default: null,
//     },
//     stateId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'State',
//     },

//     cityId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'City',
//       default: null,
//     },

//     collegeId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'College',
//       default: null,
//     },
//     classId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Class',
//       default: null,
//     },

//     passingYear: {
//       type: String,
//       default: null,
//     },
//     usedPromoCodes: [
//       {
//         promoId: { type: mongoose.Schema.Types.ObjectId, ref: 'PromoCode' },
//         appliedAt: { type: Date, default: Date.now },
//       },
//     ],
//     usageLimitPerUser: { type: Number, default: 1 },

//     password: {
//       type: String,
//       select: false,
//       default: null,
//     },

//     admissionYear: {
//       type: String,
//       trim: true,
//       default: null,
//     },

//     status: {
//       type: String,
//       enum: ['active', 'inactive', 'blocked'],
//       default: 'active',
//     },
//     role: {
//       type: String,
//       enum: ['user', 'admin'],
//       default: 'user',
//     },
//     googleId: { type: String, index: true },

//     // ✅ Yahan Login ke baad token save hoga
//     refreshToken: {
//       type: String,
//       select: false,
//       default: null,
//     },

//     signUpBy: {
//       type: String,
//       enum: ['email', 'google'],
//       default: 'email',
//     },
//     otp: {
//       type: String,
//       default: null,
//     },
//     otpExpiresAt: {
//       type: Date,
//       default: null,
//     },
//     lastOtpSentAt: {
//       type: Date,
//       default: null,
//     },

//     mobileOtp: {
//       type: String,
//       default: null,
//     },
//     mobileOtpExpiresAt: {
//       type: Date,
//       default: null,
//     },
//     lastMobileOtpSentAt: {
//       type: Date,
//       default: null,
//     },

//     // // ... baki fields ke saath ye add karein
//     // isMobileVerified: {
//     //   type: Boolean,
//     //   default: false,
//     // },
//     isMobileVerified: {
//       type: Boolean,
//       default: true, // ✅ no mobile OTP system
//     },

//     subscription: {
//       plan_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'SubscriptionPlan',
//         default: null,
//       },
//       startDate: { type: Date, default: null },
//       endDate: { type: Date, default: null },
//       isActive: { type: Boolean, default: false },
//       selectedMonths: { type: Number, default: 0 },
//     },
//     subscriptionStatus: {
//       type: String,
//       enum: ['free', 'starter', 'professional', 'premium_plus'],
//       default: 'free',
//     },
//     // ✅ Free Trial Tracking (3 Days)
//     trialExpiry: {
//       type: Date,
//       default: null,
//     },

//     isTrialExpired: {
//       type: Boolean,
//       default: false,
//     },

//     completedChapters: [
//       { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
//     ],
//     completedModulesCount: { type: Number, default: 0 },
//   },

//   { timestamps: true }
// );

// // ✅ PASSWORD HASHING MIDDLEWARE
// userSchema.pre('save', async function (next) {
//   // Agar password change NAHI hua hai (jaise sirf login token save ho raha ho), toh hashing skip karo
//   if (!this.isModified('password')) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// const UserModel = mongoose.model('User', userSchema);
// export default UserModel;

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    profileImage: {
      type: String,
      trim: true,
      default: null,
    },

    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      default: null,
    },

    address: {
      type: String,
      trim: true,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      default: null,
    },

    password: {
      type: String,
      select: false,
    },

    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    googleId: {
      type: String,
      index: true,
    },

    refreshToken: {
      type: String,
      select: false,
      default: null,
    },

    signUpBy: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
    },

    otp: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    lastOtpSentAt: {
      type: Date,
      default: null,
    },

    isMobileVerified: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // 🎙️ Egale FM Specific
    isCreator: {
      type: Boolean,
      default: false,
    },

    followersCount: {
      type: Number,
      default: 0,
    },

    followingCount: {
      type: Number,
      default: 0,
    },

    subscriptionStatus: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },

    trialExpiry: {
      type: Date,
      default: null,
    },

    isTrialExpired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// 🔐 Password Hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default mongoose.model('User', userSchema);
