export const buildGraph = (transactions) => {
  const nodesMap = new Map();
  const edges = [];

  transactions.forEach(tx => {
    // Create nodes
    if (!nodesMap.has(tx.from_acc)) {
      nodesMap.set(tx.from_acc, {
        id: tx.from_acc,
        label: tx.from_acc,
        holder_name: tx.from_holder_name || null,
        risk_score: tx.from_risk_score ?? 0,
        type: "account"
      });
    } else if (tx.from_holder_name && !nodesMap.get(tx.from_acc).holder_name) {
      nodesMap.get(tx.from_acc).holder_name = tx.from_holder_name;
    }

    if (!nodesMap.has(tx.to_acc)) {
      nodesMap.set(tx.to_acc, {
        id: tx.to_acc,
        label: tx.to_acc,
        holder_name: tx.to_holder_name || null,
        risk_score: tx.to_risk_score ?? 0,
        type: "account"
      });
    } else if (tx.to_holder_name && !nodesMap.get(tx.to_acc).holder_name) {
      nodesMap.get(tx.to_acc).holder_name = tx.to_holder_name;
    }

    // Create edge
    edges.push({
      id: tx.id,
      source: tx.from_acc,
      target: tx.to_acc,
      amount: tx.amount,
      timestamp: tx.timestamp,
      risk_score: Math.max(tx.from_risk_score ?? 0, tx.to_risk_score ?? 0)
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
};

export const buildGraphWithRisk = (transactions, alertEdges) => {
  const nodesMap = new Map();
  const edges = [];

  transactions.forEach(tx => {
    const source = tx.from_acc;
    const target = tx.to_acc;

    const edgeKey = `${source}-${target}`;

    // base risk from amount
    let risk = tx.amount > 50000 ? 0.6 : 0.2;

    // boost if part of alert
    const alertType = alertEdges.get(edgeKey) || null;
    if (alertType) {
      risk = 0.9;
    }

    // nodes
    if (!nodesMap.has(source)) {
      nodesMap.set(source, {
        id: source,
        label: source,
        holder_name: tx.from_holder_name || null,
        type: "account"
      });
    }

    if (!nodesMap.has(target)) {
      nodesMap.set(target, {
        id: target,
        label: target,
        holder_name: tx.to_holder_name || null,
        type: "account"
      });
    }

    edges.push({
      id: tx.id,
      source,
      target,
      amount: tx.amount,
      timestamp: tx.timestamp,
      risk_score: risk,
      alert: alertType,
      isSuspicious: alertEdges.has(edgeKey)
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
};

export const extractAlertPaths = (alerts) => {
  // return a Map of edgeKey -> alert.type
  const alertEdges = new Map();

  alerts.forEach(alert => {
    const path = alert.description
      .split("→")
      .map(s => s.trim());

    for (let i = 0; i < path.length - 1; i++) {
      const edgeKey = `${path[i]}-${path[i + 1]}`;
      alertEdges.set(edgeKey, alert.type || 'suspicious_path');
    }
  });

  return alertEdges;
};