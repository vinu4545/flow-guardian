import { pool } from "../db.js";

export const getAllTransactions = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { from_account, to_account, amount } = req.body;

    const result = await pool.query(
      `INSERT INTO transactions (from_account, to_account, amount)
       VALUES ($1, $2, $3) RETURNING *`,
      [from_account, to_account, amount]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
};