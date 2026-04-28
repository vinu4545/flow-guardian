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