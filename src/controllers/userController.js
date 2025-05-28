import * as userService from '../services/userService.js';

export async function register(request, response, next) {
    try {
        const payload = await userService.registerUser(request.body);
        response.status(201).json(payload);
    } catch (err) {
        next(err);
    }
}

export async function login(request, response, next) {
    try {
        const payload = await userService.loginUser(request.body);
        response.json(payload);
    } catch (err) {
        next(err);
    }
}

export async function profile(request, response) {
    response.json({ id: request.user.sub, email: request.user.email });
}