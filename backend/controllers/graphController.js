import { pool } from "../db/db.js";
import { buildGraph, buildGraphWithRisk, extractAlertPaths } from "../services/graphService.js";

const graphSelectClause = `
  SELECT t.id,
         t.amount,
         t.timestamp,
         a1.account_number::text AS from_acc,
         a2.account_number::text AS to_acc,
         a1.holder_name AS from_holder_name,
         a2.holder_name AS to_holder_name,
         a1.risk_score AS from_risk_score,
         a2.risk_score AS to_risk_score
  FROM transactions t
  JOIN accounts a1 ON t.from_account = a1.id
  JOIN accounts a2 ON t.to_account = a2.id
`;

export const getGraph = async (req, res) => {
  try {
    const result = await pool.query(`${graphSelectClause} LIMIT 100`);

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
    const accountResult = await pool.query(
      `SELECT id, account_number
       FROM accounts
       WHERE account_number = $1 OR id::text = $1
       LIMIT 1`,
      [id]
    );

    if (accountResult.rows.length === 0) {
      return res.status(404).json({
        error: "Account not found",
        account: id
      });
    }

    const account = accountResult.rows[0];

    const result = await pool.query(
      `${graphSelectClause}
       WHERE a1.id = $1 OR a2.id = $1
       ORDER BY t.timestamp ASC, t.id ASC
       LIMIT 50`,
      [account.id]
    );

    const graph = buildGraph(result.rows);

    res.json({
      account: account.account_number,
      ...graph
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Account graph failed" });
  }
};


export const getSuspiciousGraph = async (req, res) => {
  try {
    // Fetch transactions with high amounts
    const result = await pool.query(`
      ${graphSelectClause}
      WHERE t.amount > 50000
      ORDER BY t.amount DESC, t.timestamp DESC
      LIMIT 100;
    `);

    // Fetch alerts and extract paths
    const alertsResult = await pool.query(`SELECT * FROM alerts`);
    const alertEdges = extractAlertPaths(alertsResult.rows);

    // Build graph with risk scoring
    const graph = buildGraphWithRisk(result.rows, alertEdges);

    // Filter only high-risk edges (risk_score > 0.7)
    graph.edges = graph.edges.filter(e => e.risk_score > 0.7);

    res.json(graph);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Suspicious graph failed" });
  }
};