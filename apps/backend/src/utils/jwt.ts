import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (payload: object): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export const verifyToken = (token: string): any => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.verify(token, process.env.JWT_SECRET);
};
