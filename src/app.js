import errorHandler from './middleware/errorHandler.js';
import applyRoutes from './routes/applyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/apply', applyRoutes);

app.use(errorHandler);

export default app;