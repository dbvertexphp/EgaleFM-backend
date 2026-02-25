/**
 * Role-based authorization middleware
 * Admin role check karta hai
 * Sirf admin hi access kar sakte hain
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Agar admin logged in nahi hai
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route', // Access nahi kar sakte
      });
    }

    // Admin ka role check karo
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: `Admin role '${req.admin.role}' is not authorized to access this route`, // Is role ko access nahi hai
      });
    }

    next(); // Next middleware ko call karo
  };
};

