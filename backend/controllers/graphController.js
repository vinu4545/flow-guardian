import { pool } from "../db/db.js";
import { buildGraph } from "../services/graphService.js";

export const getGraph = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, 
             a1.account_number::text AS from_acc,
             a2.account_number::text AS to_acc
      FROM transactions t
      JOIN accounts a1 ON t.from_account = a1.id
      JOIN accounts a2 ON t.to_account = a2.id
      LIMIT 100;
    `);

    const graph = buildGraph(result.rows);

    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Graph fetch failed" });
  }
};

export const getGraphByAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT t.*, 
             a1.account_number::text AS from_acc,
             a2.account_number::text AS to_acc
      FROM transactions t
      JOIN accounts a1 ON t.from_account = a1.id
      JOIN accounts a2 ON t.to_account = a2.id
      WHERE a1.account_number = $1 
         OR a2.account_number = $1
      LIMIT 50;
    `, [id]);

    const graph = buildGraph(result.rows);

    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Account graph failed" });
  }
};


export const getSuspiciousGraph = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, 
             a1.account_number::text AS from_acc,
             a2.account_number::text AS to_acc
      FROM transactions t
      JOIN accounts a1 ON t.from_account = a1.id
      JOIN accounts a2 ON t.to_account = a2.id
      WHERE t.amount > 10000
      LIMIT 100;
    `);

    const graph = buildGraph(result.rows);

    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Suspicious graph failed" });
  }
};