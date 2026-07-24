import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import dotenv from 'dotenv';
import cors from 'cors';
import statsRouter from "./routes/stats.js";
import userRouter from "./routes/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const corsMiddleware = cors({
    origin: ["http://localhost:5173", "https://games-d4rk.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
})

app.set('trust proxy', 1);

app.use(corsMiddleware);
app.use(express.json());

app.options("/api/auth/*splat", corsMiddleware);

app.all("/api/auth/*splat", corsMiddleware, toNodeHandler(auth));
app.use("/api/stats", statsRouter);
app.use("/api/user", userRouter);

app.get('/', (req, res) => {
    res.redirect('https://games-d4rk.vercel.app')
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`BACKEND IS LIVE: http://localhost:${port}`);
    });
}

export default app;