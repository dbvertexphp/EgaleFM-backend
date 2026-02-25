import rateLimit from 'express-rate-limit';

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    const retryAfter = Math.ceil(req.rateLimit.resetTime - Date.now()) / 1000;
    const minutes = Math.ceil(retryAfter / 60);

    return res.status(429).json({
      message: `Too many OTP requests. Try again after ${minutes} minute(s).`,
      retryAfterSeconds: Math.ceil(retryAfter),
    });
  },
});

export const testLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: 'Too many test submissions, slow down',
});
