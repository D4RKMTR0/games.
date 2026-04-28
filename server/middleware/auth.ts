import { Request, Response, NextFunction } from "express";
import { auth } from "../auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { User } from "better-auth";

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    req.user = session.user;
    next();
}