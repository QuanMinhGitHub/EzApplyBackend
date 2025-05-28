import { verifyToken } from '../services/userService.js';

export default function authMiddleware(request, response, next) {
    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return response.status(401).json({ message: 'Missing Authorization header' });
    }

    try {
        const token = header.slice(7);
        request.user = verifyToken(token);
        next();
    } catch (error) {
        next(error);
    }
}