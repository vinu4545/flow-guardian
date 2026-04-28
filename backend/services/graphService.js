export const buildGraph = (transactions) => {
  const nodesMap = new Map();
  const edges = [];

  transactions.forEach(tx => {
    // Create nodes
    if (!nodesMap.has(tx.from_acc)) {
      nodesMap.set(tx.from_acc, {
        id: tx.from_acc,
        label: tx.from_acc,
        type: "account"
      });
    }

    if (!nodesMap.has(tx.to_acc)) {
      nodesMap.set(tx.to_acc, {
        id: tx.to_acc,
        label: tx.to_acc,
        type: "account"
      });
    }

    // Create edge
    edges.push({
      source: tx.from_acc,
      target: tx.to_acc,
      amount: tx.amount,
      timestamp: tx.timestamp,
      risk_score: tx.risk_score || 0
    });
  });

  return {
    nodes: Array.from(nodesMap.values()),
    edges
  };
};