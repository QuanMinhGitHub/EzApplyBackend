import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';

export async function registerUser({ email, password }) {
    const exists = await User.findOne({ where: { email } });
    if (exists) {
        const error = new Error('Email already in use');
        error.status = 400;
        throw error;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });
    return { id: user.id, email: user.email };
}

export async function loginUser({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw err;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        const error = new Error('Invalid credentials');
        error.status = 401;
        throw error;
    }

    const token = jwt.sign(
        { sub: user.id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );
    return { token, expiresIn: config.jwt.expiresIn };
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch {
        const error = new Error('Unauthorized');
        error.status = 401;
        throw error;
    }
}