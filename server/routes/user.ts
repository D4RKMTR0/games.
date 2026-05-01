import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { pool } from "../db/index.js";

const router = Router();

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

export default router;