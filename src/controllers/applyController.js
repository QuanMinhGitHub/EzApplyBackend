import autoapply from "../logic/autoapply.js";
import User from "../models/User.js";

export async function apply(request, response, next) {
    try {
        const { url } = request.body;
        console.log(request.body);
        if (!url) return response.status(400).json({ message: 'Missing "url" in request body' });

        const userId = request.user.sub;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['id', 'passwordHash'] }
        });
        if (!user) return response.status(404).json({ message: 'User not found' });
        response.json({ message: await autoapply(url, user.dataValues) ? "Failed to apply" : "Apply successfully" });
    } catch (error) {
        next(error);
    }
}