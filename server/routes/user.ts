import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { pool } from "../db/index.js";
import { put } from "@vercel/blob";
import multer from "multer";
import sharp from "sharp";

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

export default router;