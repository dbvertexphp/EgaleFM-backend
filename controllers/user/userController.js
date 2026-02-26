import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import UserModel from '../../models/user/userModel.js';
import { sendFormEmail } from '../../config/mail.js';
import PageModel from '../../models/admin/pageModel.js';
import generateToken from '../../config/generateToken.js';

import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

import { enforceSubscription } from '../../utils/subscriptionHelper.js';

export const loginByGoogle = async (req, res, next) => {
  console.log('Server time before verify:', new Date().toISOString());
  try {
    const { token } = req.body;
    console.log('Incoming Token:', token ? 'Token Received' : 'No Token');

    if (!token) {
      return res.status(400).json({ message: 'Google ID token is required' });
    }
    console.log('Token Length:', token.length);
    console.log('Token Starts With:', token.substring(0, 10));
    let decodedToken;
    try {
      // Backend project ID log kar rahe hain verify karne ke liye
      const currentProjectId = admin.app().options.projectId;
      console.log('🔍 Verifying token for project:', currentProjectId);
      console.log('Token Length:', token.length);
      console.log('Token Starts With:', token.substring(0, 10));
      // Firebase Token Verify karna
      decodedToken = await admin.auth().verifyIdToken(token);
      console.log('✅ Token VERIFIED successfully!');
      console.log('Decoded UID:', decodedToken.uid);
      console.log('Decoded email:', decodedToken.email);
      console.log('Full payload:', JSON.stringify(decodedToken, null, 2));
    } catch (err) {
      console.error('❌ VERIFY ERROR DETAILS:');
      console.error('Error code:', err.code);
      console.error('Error message:', err.message);
      console.error('Full error object:', err);
      return res.status(401).json({
        message: 'Invalid or Expired Firebase Token',
        error_detail: err.message,
      });
    }

    // Yahan tak tabhi pahunchega jab token SUCCESSFUL verify ho chuka ho
    const email = decodedToken.email?.toLowerCase().trim();
    const googleId = decodedToken.uid;
    const name = decodedToken.name || 'Google User';
    const picture = decodedToken.picture || null;

    if (!email) {
      return res
        .status(400)
        .json({ message: 'Invalid Google token payload: Email missing' });
    }

    // --- Database Logic ---
    let user = await UserModel.findOne({ email });

    if (!user) {
      // Naya User Banana
      user = await UserModel.create({
        name,
        email,
        googleId,
        profileImage: picture,
        signUpBy: 'google',
        isEmailVerified: true,
        role: 'user',
        trialExpiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        isTrialExpired: false,
      });
      console.log('🆕 New User Created via Google Sign-In');
    } else {
      // Existing User Update karna
      let isUpdated = false;
      if (!user.googleId) {
        user.googleId = googleId;
        isUpdated = true;
      }
      if (!user.profileImage && picture) {
        user.profileImage = picture;
        isUpdated = true;
      }

      if (isUpdated) await user.save();
      console.log('🏠 Existing User Logged In');
    }
    // 🔐 Subscription / Trial Check
    if (!(await enforceSubscription(user._id, res))) return;

    // JWT Token generation (Backend specific)
    const { accessToken, refreshToken } = generateToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password; // Password agar ho toh security ke liye delete karein
    delete safeUser.refreshToken;

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user: safeUser,
    });
  } catch (err) {
    console.error('🔥 Global Google Login Error:', err);
    return res.status(500).json({
      message: 'Internal Server Error during Google Login',
      error_detail: err.message,
    });
  }
};
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// export const register = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const {
//       name,
//       email,
//       mobile,
//       address,
//       countryName, // 👈 user se aayega
//       stateId,
//       cityId,
//       collegeName,
//       classId,
//       admissionYear,
//       password,
//     } = req.body;

//     let finalClassId = classId;
//     if (finalClassId === '') finalClassId = null;

//     // 1️⃣ Basic Validation
//     if (
//       !name ||
//       !email ||
//       !password ||
//       // !countryName ||
//       !stateId ||
//       !cityId ||
//       !collegeName
//     ) {
//       if (session.inTransaction()) await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({
//         success: false,
//         message:
//           'All fields (Name, Email, Password, Country, State, City, College Name) are required.',
//       });
//     }

//     // 2️⃣ COUNTRY AUTO FIND-OR-CREATE
//     let country = null;
//     let countryId = null;

//     if (countryName && countryName.trim() !== '') {
//       country = await Country.findOne({
//         name: { $regex: new RegExp(`^${countryName.trim()}$`, 'i') },
//       });

//       if (!country) {
//         const [createdCountry] = await Country.create(
//           [
//             {
//               name: countryName.trim(),
//               isActive: true,
//             },
//           ],
//           { session }
//         );
//         country = createdCountry;
//       }

//       if (!country.isActive) {
//         country.isActive = true;
//         await country.save({ session });
//       }

//       countryId = country._id;
//     }

//     // 3️⃣ STATE VALIDATION (NO countryId)
//     const activeState = await State.findOne({
//       _id: stateId,
//       isActive: true,
//     });

//     if (!activeState) {
//       if (session.inTransaction()) await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({
//         success: false,
//         message: 'Selected state is not active.',
//       });
//     }

//     // 4️⃣ CITY VALIDATION (ONLY stateId)
//     const cityExists = await City.findOne({
//       _id: cityId,
//       stateId: stateId,
//     });

//     if (!cityExists) {
//       if (session.inTransaction()) await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid city selection for this state.',
//       });
//     }

//     // 5️⃣ Dynamic College Logic
//     let college = await College.findOne({
//       name: { $regex: new RegExp(`^${collegeName.trim()}$`, 'i') },
//       cityId,
//     }).session(session);

//     if (!college) {
//       const createdColleges = await College.create(
//         [
//           {
//             name: collegeName.trim(),
//             cityId,
//             stateId,
//             isActive: true,
//           },
//         ],
//         { session }
//       );
//       college = createdColleges[0];
//     }

//     // 6️⃣ Class Validation
//     if (finalClassId) {
//       const classExists = await ClassModel.findById(finalClassId);
//       if (!classExists) {
//         if (session.inTransaction()) await session.abortTransaction();
//         session.endSession();
//         return res
//           .status(400)
//           .json({ success: false, message: 'Invalid class selected.' });
//       }
//     }

//     // 7️⃣ Password & User Existence
//     if (password.length < 6) {
//       if (session.inTransaction()) await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({
//         success: false,
//         message: 'Password must be at least 6 characters.',
//       });
//     }

//     const normalizedEmail = email.toLowerCase().trim();
//     const existingUser = await UserModel.findOne({ email: normalizedEmail });
//     if (mobile) {
//       const mobileExists = await UserModel.findOne({ mobile });
//       if (mobileExists) {
//         if (session.inTransaction()) await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({
//           success: false,
//           message: 'User already exists with this mobile number.',
//         });
//       }
//     }

//     if (existingUser) {
//       if (session.inTransaction()) await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists with this email.',
//       });
//     }

//     const emailOtp = generateOtp();
//     const now = new Date();

//     // const mobileOtp = generateOtp();

//     const [user] = await UserModel.create(
//       [
//         {
//           name,
//           email: normalizedEmail,
//           password,
//           otp: emailOtp,
//           otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
//           lastOtpSentAt: now,
//           // mobile,
//           // mobileOtp,
//           // mobileOtpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
//           mobile,
//           isMobileVerified: true, // ✅ auto-verify mobile
//           address,
//           countryId,
//           stateId,
//           cityId,
//           collegeId: college._id,
//           classId: finalClassId,
//           admissionYear,
//           signUpBy: 'email',
//           role: 'user',
//           trialExpiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//           isTrialExpired: false,
//         },
//       ],
//       { session }
//     );

//     // 9️⃣ Commit and Cleanup
//     await session.commitTransaction();
//     session.endSession();
//     await sendFormEmail(normalizedEmail, emailOtp);

//     // 🔽 TEMP: CONSOLE MOBILE OTP
//     // console.log(`📱 Mobile OTP for ${mobile}: ${mobileOtp}`);

//     /*
// ==============================
//  HERE PAID SMS SERVICE CODE AAYEGA
//  e.g. Twilio / MSG91 / Fast2SMS
// ==============================
// await sendSms(mobile, `Your OTP is ${mobileOtp}`);
// */

//     // 🔟 Populate for Response
//     const populatedUser = await UserModel.findById(user._id)
//       .populate('countryId', 'name')
//       .populate('stateId', 'name')
//       .populate('cityId', 'name')
//       .populate('collegeId', 'name')
//       .populate('classId', 'name');

//     return res.status(201).json({
//       success: true,
//       message: 'User registered successfully. Please verify your email.',
//       data: populatedUser,
//     });
//   } catch (error) {
//     if (session.inTransaction()) {
//       await session.abortTransaction();
//     }
//     session.endSession();
//     next(error);
//   }
// };

export const register = async (req, res, next) => {
  try {
    const { name, email, password, mobile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, Email and Password are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await UserModel.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    if (mobile) {
      const mobileExists = await UserModel.findOne({ mobile });
      if (mobileExists) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this mobile number',
        });
      }
    }

    const emailOtp = generateOtp();

    const user = await UserModel.create({
      name,
      email: normalizedEmail,
      password,
      mobile,
      otp: emailOtp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      lastOtpSentAt: new Date(),
      role: 'user',
      trialExpiry: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    await sendFormEmail(normalizedEmail, emailOtp);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully. Please verify your email.',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // ✅ basic validation
    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required',
      });
    }

    const user = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // ✅ already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        message: 'Email is already verified',
      });
    }

    // ✅ OTP + expiry check
    if (
      !user.otp ||
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt.getTime() < Date.now()
    ) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    // ✅ activate user
    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    // ✅ block/inactive check before issuing token
    if (user.status !== 'active') {
      return res.status(403).json({
        message: 'Account is blocked or inactive',
      });
    }

    // const { accessToken, refreshToken } = generateToken(user._id);

    // ✅ safe user object
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      status: user.status,
    };

    res.json({
      message: 'Email verified successfully',
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyMobile = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile and OTP are required' });
    }

    const user = await UserModel.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isMobileVerified) {
      return res.status(400).json({ message: 'Mobile already verified' });
    }

    if (
      !user.mobileOtp ||
      user.mobileOtp !== otp ||
      !user.mobileOtpExpiresAt ||
      user.mobileOtpExpiresAt.getTime() < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isMobileVerified = true;
    user.mobileOtp = null;
    user.mobileOtpExpiresAt = null;
    await user.save();

    return res.json({ message: 'Mobile verified successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    let { email, mobile, password } = req.body;

    email = email?.toLowerCase().trim();
    mobile = mobile?.trim();

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    if ((!email && !mobile) || (email && mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Provide either email or mobile (not both)',
      });
    }

    let user;

    // 🔐 EMAIL LOGIN
    if (email) {
      user = await UserModel.findOne({ email }).select('+password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email first',
        });
      }
    }

    // 📱 MOBILE LOGIN
    if (mobile) {
      user = await UserModel.findOne({ mobile }).select('+password');

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }
    }

    // 🚫 STATUS CHECK
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is blocked or inactive',
      });
    }

    // 🔑 PASSWORD CHECK
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // 🎟 TOKEN GENERATION
    const { accessToken, refreshToken } = generateToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    const safeUser = user.toObject();

    delete safeUser.password;
    delete safeUser.otp;
    delete safeUser.otpExpiresAt;
    delete safeUser.refreshToken;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: safeUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (req, res, next) => {
  try {
    let { email, mobile } = req.body;

    email = email?.toLowerCase().trim();
    mobile = mobile?.trim();

    if ((!email && !mobile) || (email && mobile)) {
      return res.status(400).json({
        message: 'Provide either email or mobile',
      });
    }

    let user;
    let mode;

    if (email) {
      user = await UserModel.findOne({ email });
      mode = 'email';
    }

    if (mobile) {
      user = await UserModel.findOne({ mobile });
      mode = 'mobile';
    }

    // Anti enumeration
    if (!user) {
      return res.status(200).json({
        message: 'If this account exists, an OTP has been sent',
      });
    }

    // Already verified check
    if (mode === 'email' && user.isEmailVerified) {
      return res.status(400).json({
        message: 'Email already verified',
      });
    }

    if (mode === 'mobile' && user.isMobileVerified) {
      return res.status(400).json({
        message: 'Mobile already verified',
      });
    }

    // Cooldown check (1 min)
    const now = Date.now();
    if (user.lastOtpSentAt && now - user.lastOtpSentAt.getTime() < 60000) {
      const remaining =
        60 - Math.floor((now - user.lastOtpSentAt.getTime()) / 1000);

      return res.status(429).json({
        message: `Please wait ${remaining} seconds before requesting another OTP`,
        retryAfterSeconds: remaining,
      });
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.lastOtpSentAt = new Date();

    await user.save();

    if (mode === 'email') {
      await sendFormEmail(user.email, otp);
    }

    return res.status(200).json({
      message:
        mode === 'email'
          ? 'Email OTP resent successfully'
          : 'Mobile OTP resent successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (req, res, next) => {
  try {
    let { email } = req.body;
    email = email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
      });
    }

    const user = await UserModel.findOne({ email });

    // Anti enumeration
    if (!user) {
      return res.status(200).json({
        message: 'If this email exists, an OTP has been sent',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        message: 'Account is blocked or inactive',
      });
    }

    const now = Date.now();

    if (user.lastOtpSentAt && now - user.lastOtpSentAt.getTime() < 60000) {
      const remaining =
        60 - Math.floor((now - user.lastOtpSentAt.getTime()) / 1000);

      return res.status(429).json({
        message: `Please wait ${remaining} seconds before requesting another OTP`,
        retryAfterSeconds: remaining,
      });
    }

    const otp = generateOtp();

    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    user.lastOtpSentAt = new Date();

    await user.save();
    await sendFormEmail(user.email, otp);

    return res.status(200).json({
      message: 'If this email exists, an OTP has been sent',
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    let { email, otp, newPassword } = req.body;

    email = email?.toLowerCase().trim();

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: 'Email, OTP and new password are required',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        message: 'Invalid OTP or request expired',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        message: 'Account is blocked or inactive',
      });
    }

    if (
      !user.otp ||
      user.otp !== otp ||
      !user.otpExpiresAt ||
      user.otpExpiresAt.getTime() < Date.now()
    ) {
      return res.status(400).json({
        message: 'Invalid or expired OTP',
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: 'New password must be different from old password',
      });
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    user.lastOtpSentAt = null;

    await user.save();

    return res.status(200).json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // DB se token remove karo
    const user = await UserModel.findByIdAndUpdate(
      userId,
      {
        refreshToken: null, // ya token field jo tum use kar rahe ho
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (!(await enforceSubscription(req.user._id, res))) return;

    // req.user protect middleware se aata hai
    const user = await UserModel.findById(req.user._id)
      .select('-password -otp -otpExpiresAt -refreshToken')
      .populate('collegeId', 'name') // 🔥 College ka naam lene ke liye
      .populate('stateId', 'name') // 🔥 State ka naam lene ke liye
      .populate('cityId', 'name');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User session valid',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getSlugByQuery = async (req, res, next) => {
  try {
    let { slug } = req.query;

    // ✅ ADD: validation + normalization
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({
        message: 'slug query parameter is required',
      });
    }

    slug = slug.trim().toLowerCase();

    const page = await PageModel.findOne({
      slug,
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    }).select('slug title content');

    if (!page) {
      return res.status(404).json({
        message: 'Page not found',
      });
    }

    // ✅ ADD: cache for static pages
    res.set('Cache-Control', 'public, max-age=300');

    res.status(200).json({
      success: true,
      data: page,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserData = async (req, res, next) => {
  try {
    const { id } = req.params;

    // ✅ ADD: validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user id',
      });
    }

    // ✅ ADD: authorization (user can access only own data)
    if (req.user._id.toString() !== id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    const userData = await UserModel.findById(id)
      .select('-password -otp -otpExpiresAt')
      .populate('collegeId', 'name') // 🔥 College ka naam lene ke liye
      .populate('stateId', 'name') // 🔥 State ka naam lene ke liye
      .populate('cityId', 'name');

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

export const editProfileOfUser = async (req, res, next) => {
  try {
    // ✅ WHITELIST allowed fields
    const allowedFields = [
      'name',
      'mobile',
      'address',
      'countryId',
      'stateId',
      'cityId',

      'classId',
      'passingYear',
      'admissionYear',
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // ✅ COLLEGE NAME UPDATE (NO REQUIRED CITY / STATE)
    if (req.body.collegeName) {
      const collegeName = req.body.collegeName.trim();

      // user ka current data nikaalo
      const currentUser = await UserModel.findById(req.user._id).select(
        'cityId stateId'
      );

      const cityId = req.body.cityId || currentUser?.cityId || null;
      const stateId = req.body.stateId || currentUser?.stateId || null;

      let collegeQuery = {
        name: { $regex: new RegExp(`^${collegeName}$`, 'i') },
      };

      if (cityId) {
        collegeQuery.cityId = cityId;
      }

      let college = await College.findOne(collegeQuery);

      // agar college nahi mila → create kar do
      if (!college) {
        college = await College.create({
          name: collegeName,
          cityId,
          stateId,
          isActive: true,
        });
      }

      updateData.collegeId = college._id;
    }

    // ✅ Image upload
    if (req.file) {
      updateData.profileImage = `/uploads/user-profile/${req.file.filename}`;
    }

    // ✅ Empty update protection
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields provided for update',
      });
    }

    // ✅ LOCATION VALIDATION (FIXED: no countryId check)
    const { stateId, cityId } = updateData;

    if (stateId && cityId) {
      const validCity = await City.findOne({
        _id: cityId,
        stateId,
      });

      if (!validCity) {
        return res.status(400).json({
          success: false,
          message: 'Invalid state and city combination',
        });
      }
    }

    // ✅ CLASS VALIDATION
    if (updateData.classId) {
      const validClass = await ClassModel.findById(updateData.classId);
      if (!validClass) {
        return res.status(400).json({
          success: false,
          message: 'Invalid class',
        });
      }
    }

    // ✅ UPDATE USER
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.user._id,
      updateData,
      {
        new: true,
        select: '-password -otp -otpExpiresAt',
      }
    ).populate('collegeId', 'name');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};
