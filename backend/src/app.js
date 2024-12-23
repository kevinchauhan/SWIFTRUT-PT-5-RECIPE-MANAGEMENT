import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import posts from './routes/posts.js';
import db from './config/db.js';
import { Config } from './config/index.js';

const app = express();
const corsOptions = {
    origin: Config.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

db()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(morgan());
app.use(helmet());

app.use("/api/posts", posts);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

export default app;
