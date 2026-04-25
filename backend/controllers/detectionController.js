import { pool } from "../db.js";

export const detectCircularTransactions = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions");
    const transactions = result.rows;

    const graph = {};

    // Build adjacency list
    transactions.forEach(tx => {
      if (!graph[tx.from_account]) {
        graph[tx.from_account] = [];
      }
      graph[tx.from_account].push(tx.to_account);
    });

    const visited = new Set();
    const stack = new Set();
    const cycles = [];

    function dfs(node, path) {
      if (stack.has(node)) {
        const cycleStart = path.indexOf(node);
        const cycle = path.slice(cycleStart);
        cycles.push([...cycle, node]);
        return;
      }

      if (visited.has(node)) return;

      visited.add(node);
      stack.add(node);

      const neighbors = graph[node] || [];
      for (let neighbor of neighbors) {
        dfs(neighbor, [...path, node]);
      }

      stack.delete(node);
    }

    Object.keys(graph).forEach(node => {
      dfs(parseInt(node), []);
    });

    // Store alerts
    for (let cycle of cycles) {
      const description = `Cycle detected: ${cycle.join(" → ")}`;

      // Check if already exists
      const existing = await pool.query(
        `SELECT * FROM alerts WHERE description = $1`,
        [description]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO alerts (type, description, severity)
           VALUES ($1, $2, $3)`,
          ["circular", description, "high"]
        );
      }
    }

    res.json({
      message: "Detection complete",
      cycles_found: cycles.length,
      cycles
    });

  } catch (err) {
    console.error("DETECTION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};