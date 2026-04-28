import { pool } from "../db/db.js";

export const getAlerts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM alerts ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
};

export const createAlert = async (req, res) => {
  try {
    const { type, description, severity } = req.body;

    const result = await pool.query(
      `INSERT INTO alerts (type, description, severity)
       VALUES ($1, $2, $3) RETURNING *`,
      [type, description, severity]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create alert" });
  }
};