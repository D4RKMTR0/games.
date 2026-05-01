import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { pool } from "../db/index.js";

const router = Router();

// GET /api/stats/:gameId
router.get("/:gameId", requireAuth, async (req, res) => {
    const { gameId } = req.params;
    const userId = req.user!.id;

    const result = await pool.query(
        `SELECT * FROM stats WHERE user_id = $1 AND game_id = $2`,
        [userId, gameId]
    );

    res.json(result.rows[0] ?? null);
});

// POST /api/stats/:gameId
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

router.get("/", requireAuth, async (req, res) => {
    const userId = req.user!.id
    const result = await pool.query(
        `SELECT * FROM stats WHERE user_id = $1`,
        [userId]
    )
    res.json(result.rows)
})

export default router;