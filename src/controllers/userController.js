import User from '../models/User.js';
import * as userService from '../services/userService.js';

export async function register(request, response, next) {
    try {
        const payload = await userService.registerUser(request.body);
        response.status(201).json(payload);
    } catch (error) {
        next(error);
    }
}

export async function login(request, response, next) {
    try {
        const payload = await userService.loginUser(request.body);
        response.json(payload);
    } catch (error) {
        next(error);
    }
}

export async function getProfile(request, response, next) {
    try {
        const user = await User.findByPk(request.user.sub, {
            attributes: { exclude: ['passwordHash'] }
        });
        if (!user) return response.status(404).json({ message: 'User not found' });
        response.json(user);
    } catch (error) {
        next(error);
    }
}

export async function updateProfile(request, response, next) {
    try {
        const updated = await userService.updateUserProfile(request.user.sub, request.body);
        response.json(updated);
    } catch (error) {
        next(error);
    }
}