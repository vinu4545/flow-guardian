import { pool } from "../db/db.js";

export async function getGraphData() {
  const query = "SELECT category, SUM(amount) AS total FROM transactions GROUP BY category";
  const { rows } = await pool.query(query);
  return rows;
}
