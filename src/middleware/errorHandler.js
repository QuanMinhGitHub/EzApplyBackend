export default function errororHandler(error, request, response, next) {
    response
        .status(error.status || 500)
        .json({ message: error.message || 'Internal Server erroror' });
}