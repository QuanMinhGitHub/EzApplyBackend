import dotenv from 'dotenv';
dotenv.config();

export default {
    port: process.env.PORT || 3000,
    dbUrl: process.env.DATABASE_URL,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    },
};