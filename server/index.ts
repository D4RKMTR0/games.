import express from 'express';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth.js";
import dotenv from 'dotenv';
import cors from 'cors';
import statsRouter from "./routes/stats.ts";

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
    res.send(`
        <html>
            <head>
                <title>Games. API</title>
                <meta http-equiv="refresh" content="3;url=https://games-d4rk.vercel.app" />
                <style>
                    body { 
                        font-family: sans-serif; 
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        height: 100vh; 
                        background: #090909; 
                        color: #fff; 
                    }
                </style>
            </head>
            <body>
                <div>
                    <h1>Games API is running...</h1>
                    <p>Redirecting you to the portal in 3 seconds.</p>
                </div>
            </body>
        </html>
    `);
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`-----------------------------------------`);
        console.log(`BACKEND IS LIVE: http://localhost:${port}`);
        console.log(`-----------------------------------------`);
    });
}

export default app;