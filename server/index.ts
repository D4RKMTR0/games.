import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import dotenv from 'dotenv';
import cors from 'cors';
import statsRouter from "./routes/stats.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: ["http://localhost:5173", "https://games-d4rk.vercel.app"],
    credentials: true,
}));

app.use(express.json());

app.all("/api/auth/*path", toNodeHandler(auth));
app.use("/api/stats", statsRouter);

app.get('/', (req, res) => {
    res.redirect('https://games-d4rk.vercel.app')
})

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`BACKEND IS LIVE: http://localhost:${port}`);
    });
}

export default app;