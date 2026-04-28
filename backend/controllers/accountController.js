import { pool } from "../db/db.js";

export const getAllAccounts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM accounts");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

export const createAccount = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "Request body is required. Please send JSON data with Content-Type: application/json" });
    }

    const { account_number, holder_name } = req.body;

    if (!account_number || !holder_name) {
      return res.status(400).json({ error: "account_number and holder_name are required" });
    }

    const result = await pool.query(
      `INSERT INTO accounts (account_number, holder_name)
       VALUES ($1, $2) RETURNING *`,
      [account_number, holder_name]
    );

    res.json(result.rows[0]);
  } catch (err) {
  console.error("CREATE ACCOUNT ERROR:", err);
  res.status(500).json({ error: err.message });
}
};