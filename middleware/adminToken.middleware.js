import Admin from '../models/admin/admin.model.js';

/**
 * Validate admin token provided in headers (Authorization Bearer or x-admin-token).
 * If token exists in AdminDB, allow the request to proceed.
 */
export const validateAdminToken = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers['x-admin-token']) {
      token = req.headers['x-admin-token'];
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
      });
    }

    const admin = await Admin.findOne({ token });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token',
      });
    }

    // attach token owner's id for any downstream use (optional)
    req.tokenAdminId = admin._id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token validation failed',
    });
  }
};
