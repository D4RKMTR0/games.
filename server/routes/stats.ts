import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { pool } from "../db/index.js";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const result = await pool.query(
        `SELECT * FROM stats WHERE user_id = $1`,
        [userId]
    );
    res.json(result.rows);
});

router.get("/leaderboard/:gameId", async (req, res) => {
    const { gameId } = req.params;

    const result = await pool.query(
        `SELECT 
            u.username,
            u.name,
            u.image,
            s.won,
            s.lost,
            s.drew,
            CASE 
                WHEN (s.won + s.lost + s.drew) = 0 THEN 0
                ELSE ROUND((s.won::numeric / (s.won + s.lost + s.drew)) * 100)
            END AS win_rate
         FROM stats s
         JOIN "user" u ON u.id = s.user_id
         WHERE s.game_id = $1
           AND (s.won + s.lost + s.drew) > 0
         ORDER BY s.won DESC, win_rate DESC
         LIMIT 20`,
        [gameId]
    );

    res.json(result.rows);
});

router.get("/:gameId", requireAuth, async (req, res) => {
    const { gameId } = req.params;
    const userId = req.user!.id;

    const result = await pool.query(
        `SELECT * FROM stats WHERE user_id = $1 AND game_id = $2`,
        [userId, gameId]
    );

    res.json(result.rows[0] ?? null);
});

router.post("/:gameId", requireAuth, async (req, res) => {
    const { gameId } = req.params;
    const userId = req.user!.id;
    const { won, lost, drew, data } = req.body;

    await pool.query(
        `INSERT INTO stats (user_id, game_id, won, lost, drew, data)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, game_id)
         DO UPDATE SET
             won = stats.won + $3,
             lost = stats.lost + $4,
             drew = stats.drew + $5,
             data = stats.data || $6,
             updated_at = NOW()`,
        [userId, gameId, won ?? 0, lost ?? 0, drew ?? 0, data ?? {}]
    );

    res.json({ success: true });
});

export default router;