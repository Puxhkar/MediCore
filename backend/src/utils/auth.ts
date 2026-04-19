import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_medicore_key_2026';

export const hashPassword = (password: string): string => {
    // Fall back to crypto.pbkdf2Sync if bcryptjs is unavailable due to missing npm
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, storedHash: string): boolean => {
    const [salt, key] = storedHash.split(':');
    if (!salt || !key) return false;
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === key;
};

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};
