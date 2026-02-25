//

import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // short lived
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // long lived
  );

  return { accessToken, refreshToken };
};

export default generateToken;
