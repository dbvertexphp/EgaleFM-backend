
import jwt from 'jsonwebtoken';
import Admin from '../models/admin/admin.model.js';
import UserModel from '../models/user/userModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔹 ADMIN CHECK
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.admin = admin;
        return next();
      }

      // 🔹 USER CHECK
      const user = await UserModel.findById(decoded.id).select(
        '-password -otp -otpExpiresAt'
      );

      if (user) {
        if (user.status !== 'active') {
          return res.status(403).json({
            success: false,
            message: 'User is blocked or inactive',
          });
        }

        // ❌ YE 3 LINE POORI TARAH REMOVE KAR DO
        // if (!user.refreshToken || user.refreshToken !== token) {
        //   return res.status(401).json({
        //     success: false,
        //     message: 'Not authorized, token invalid or logged out',
        //   });
        // }

        req.user = user;
        return next();
      }

      return res.status(401).json({
        success: false,
        message: 'User or Admin not found',
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Not authorized, no token',
  });
};

export const adminOnly = (req, res, next) => {
  if (req.admin) return next();

  return res.status(403).json({
    success: false,
    message: 'Access denied: Admins only',
  });
};
