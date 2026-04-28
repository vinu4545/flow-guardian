import { pool } from "../db/db.js";

export const detectCircularTransactions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*, 
             a1.account_number::text AS from_acc,
             a2.account_number::text AS to_acc
      FROM transactions t
      JOIN accounts a1 ON t.from_account = a1.id
      JOIN accounts a2 ON t.to_account = a2.id
    `);
    const transactions = result.rows;

    const graph = {};

    const normalizeAcc = value => {
      const acc = String(value);
      return acc.startsWith("ACC") ? acc : `ACC${acc}`;
    };

    // Build adjacency list
    transactions.forEach(tx => {
      const fromAcc = normalizeAcc(tx.from_acc);
      const toAcc = normalizeAcc(tx.to_acc);
      if (!graph[fromAcc]) {
        graph[fromAcc] = [];
      }
      graph[fromAcc].push(toAcc);
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
      dfs(node, []);
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



export const detectLayering = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT t.*,
             a1.account_number::text AS from_acc,
             a2.account_number::text AS to_acc
      FROM transactions t
      JOIN accounts a1 ON t.from_account = a1.id
      JOIN accounts a2 ON t.to_account = a2.id
    `);

    const transactions = result.rows;

    const graph = {};
    const normalizeAcc = value => {
      const acc = String(value);
      return acc.startsWith("ACC") ? acc : `ACC${acc}`;
    };

    transactions.forEach(tx => {
      const fromAcc = normalizeAcc(tx.from_acc);
      const toAcc = normalizeAcc(tx.to_acc);
      if (!graph[fromAcc]) {
        graph[fromAcc] = [];
      }
      graph[fromAcc].push(toAcc);
    });

    const paths = [];
    const visited_global = new Set();

    function dfs(node, path, visited_local) {
      // Record path when it reaches length 5
      if (path.length === 5) {
        paths.push([...path]);
        return;
      }

      const neighbors = graph[node] || [];
      for (let neighbor of neighbors) {
        if (!visited_local.has(neighbor)) {
          visited_local.add(neighbor);
          dfs(neighbor, [...path, neighbor], visited_local);
          visited_local.delete(neighbor);
        }
      }
    }

    // Start DFS from each node
    Object.keys(graph).forEach(startNode => {
      if (!visited_global.has(startNode)) {
        visited_global.add(startNode);
        const visited_local = new Set([startNode]);
        dfs(startNode, [startNode], visited_local);
        visited_global.delete(startNode);
      }
    });

    // Remove duplicate paths
    const uniquePaths = [];
    const pathSet = new Set();
    for (let path of paths) {
      const key = JSON.stringify(path);
      if (!pathSet.has(key)) {
        pathSet.add(key);
        uniquePaths.push(path);
      }
    }

    // Store alerts
    for (let path of uniquePaths) {
      const description = `Layering detected: ${path.join(" → ")}`;

      const existing = await pool.query(
        `SELECT * FROM alerts WHERE description = $1`,
        [description]
      );

      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO alerts (type, description, severity)
           VALUES ($1, $2, $3)`,
          ["layering", description, "medium"]
        );
      }
    }

    res.json({
      message: "Layering detection complete",
      count: uniquePaths.length,
      paths: uniquePaths
    });

  } catch (err) {
    console.error("LAYERING ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};