import errorHandler from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import express from 'express';

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;