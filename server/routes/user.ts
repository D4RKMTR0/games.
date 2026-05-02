import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { pool } from "../db/index.js";
import { put } from "@vercel/blob";
import multer from "multer";
import sharp from "sharp";

const router = Router();

// ─── Authenticated routes first ──────────────────────────────────────────────

router.patch("/update", requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const { name, theme } = req.body;

    const fields = [];
    const values = [];
    let i = 1;

    if (name) { fields.push(`name = $${i++}`); values.push(name); }
    if (theme) { fields.push(`theme = $${i++}`); values.push(theme); }

    if (fields.length === 0) {
        res.status(400).json({ error: "No fields to update" });
        return;
    }

    values.push(userId);

    await pool.query(
        `UPDATE "user" SET ${fields.join(", ")}, "updatedAt" = NOW() WHERE id = $${i}`,
        values
    );

    res.json({ success: true });
});

const upload = multer({ storage: multer.memoryStorage() })

router.post("/avatar", requireAuth, upload.single("avatar"), async (req, res) => {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
        res.status(400).json({ error: "No file provided" });
        return;
    }

    const compressed = await sharp(file.buffer)
        .resize(400, 400, { fit: "cover", position: "center" })
        .webp({ quality: 80 })
        .toBuffer()

    const blob = await put(`avatars/${userId}.webp`, compressed, {
        access: "public",
        contentType: "image/webp",
    })

    await pool.query(
        `UPDATE "user" SET image = $1, "updatedAt" = NOW() WHERE id = $2`,
        [blob.url, userId]
    )

    res.json({ url: blob.url })
})

router.delete("/delete", requireAuth, async (req, res) => {
    const userId = req.user!.id
    await pool.query(`DELETE FROM "user" WHERE id = $1`, [userId])
    res.json({ success: true })
})

router.patch("/reset-avatar", requireAuth, async (req, res) => {
    const userId = req.user!.id;
    const defaultAvatar = "https://o1n6wjzhyksrqjmz.public.blob.vercel-storage.com/profilepicture.png";

    await pool.query(
        `UPDATE "user" 
         SET image = $1, "updatedAt" = NOW() 
         WHERE id = $2`,
        [defaultAvatar, userId]
    );

    res.json({ 
        success: true, 
        url: defaultAvatar 
    });
});

// ─── Public routes last (wildcards must come after named routes) ──────────────

router.get("/:username/stats", async (req, res) => {
    const { username } = req.params;

    const userResult = await pool.query(
        `SELECT id FROM "user" WHERE username = $1 LIMIT 1`,
        [username]
    );

    if (userResult.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const userId = userResult.rows[0].id;

    const statsResult = await pool.query(
        `SELECT game_id, won, lost, drew
         FROM stats
         WHERE user_id = $1`,
        [userId]
    );

    res.json(statsResult.rows);
});

router.get("/:username/history", async (req, res) => {
    const { username } = req.params;

    const userResult = await pool.query(
        `SELECT id FROM "user" WHERE username = $1 LIMIT 1`,
        [username]
    );

    if (userResult.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const userId = userResult.rows[0].id;

    const historyResult = await pool.query(
        `SELECT id, game_id, result, played_at
         FROM match_history
         WHERE user_id = $1
         ORDER BY played_at DESC`,
        [userId]
    );

    res.json(historyResult.rows);
});

router.get("/:username/achievements", async (req, res) => {
    const { username } = req.params;

    const userResult = await pool.query(
        `SELECT id FROM "user" WHERE username = $1 LIMIT 1`,
        [username]
    );

    if (userResult.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    const userId = userResult.rows[0].id;

    const achievementsResult = await pool.query(
        `SELECT a.id, a.name, a.description, a.icon, a.game_id, ua.unlocked_at
         FROM user_achievements ua
         JOIN achievements a ON a.id = ua.achievement_id
         WHERE ua.user_id = $1
         ORDER BY ua.unlocked_at DESC`,
        [userId]
    );

    res.json(achievementsResult.rows);
});

router.get("/:username", async (req, res) => {
    const { username } = req.params;

    const result = await pool.query(
        `SELECT name, username, image, "createdAt"
         FROM "user"
         WHERE username = $1
         LIMIT 1`,
        [username]
    );

    if (result.rows.length === 0) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    res.json(result.rows[0]);
});

export default router;