export const dashboardStats = [
  { label: "Total Transactions", value: 284753, prefix: "", suffix: "", change: 12.5, sparkline: [40, 55, 45, 60, 75, 65, 80, 90, 85, 95] },
  { label: "Flagged Alerts", value: 1247, prefix: "", suffix: "", change: -8.3, sparkline: [30, 45, 40, 35, 50, 45, 40, 38, 35, 30] },
  { label: "Active Cases", value: 89, prefix: "", suffix: "", change: 5.2, sparkline: [20, 25, 30, 28, 35, 40, 38, 42, 45, 48] },
  { label: "Risk Score Avg", value: 67, prefix: "", suffix: "%", change: -2.1, sparkline: [70, 72, 68, 65, 70, 67, 65, 68, 66, 67] },
];

export const riskDistribution = [
  { name: "Low Risk", value: 65, color: "hsl(160, 84%, 39%)" },
  { name: "Medium Risk", value: 23, color: "hsl(38, 92%, 50%)" },
  { name: "High Risk", value: 12, color: "hsl(0, 84%, 60%)" },
];

export const recentAlerts = [
  { id: "ALT-4821", type: "Circular Flow", account: "ACC-9281", risk: "high", time: "2 min ago", amount: "$142,500" },
  { id: "ALT-4820", type: "Structuring", account: "ACC-7712", risk: "high", time: "8 min ago", amount: "$9,800" },
  { id: "ALT-4819", type: "Layering", account: "ACC-3384", risk: "medium", time: "15 min ago", amount: "$67,200" },
  { id: "ALT-4818", type: "Dormant Activation", account: "ACC-5519", risk: "medium", time: "22 min ago", amount: "$31,000" },
  { id: "ALT-4817", type: "Structuring", account: "ACC-1193", risk: "low", time: "45 min ago", amount: "$8,500" },
];

export const transactionVolume = [
  { date: "Jan", legitimate: 4200, suspicious: 180 },
  { date: "Feb", legitimate: 3800, suspicious: 220 },
  { date: "Mar", legitimate: 5100, suspicious: 150 },
  { date: "Apr", legitimate: 4700, suspicious: 310 },
  { date: "May", legitimate: 5300, suspicious: 280 },
  { date: "Jun", legitimate: 4900, suspicious: 190 },
  { date: "Jul", legitimate: 5800, suspicious: 350 },
];

export const fraudPatterns = [
  {
    id: "circular",
    name: "Circular Transactions",
    description: "Round-tripping: funds flow A → B → C → A to obscure origin",
    detected: 23,
    risk: "high" as const,
    icon: "🔄",
  },
  {
    id: "layering",
    name: "Layering",
    description: "Multiple rapid transfers through intermediary accounts",
    detected: 45,
    risk: "high" as const,
    icon: "📊",
  },
  {
    id: "structuring",
    name: "Structuring",
    description: "Repeated transactions just below reporting thresholds",
    detected: 67,
    risk: "medium" as const,
    icon: "📐",
  },
  {
    id: "dormant",
    name: "Dormant Activation",
    description: "Inactive accounts suddenly receiving large transactions",
    detected: 12,
    risk: "medium" as const,
    icon: "💤",
  },
];

export const graphNodes = [
  { id: "1", type: "account", data: { label: "ACC-9281", name: "Shell Corp A", risk: "high", balance: "$2.4M" }, position: { x: 250, y: 0 } },
  { id: "2", type: "account", data: { label: "ACC-7712", name: "Offshore Ltd", risk: "high", balance: "$1.8M" }, position: { x: 500, y: 150 } },
  { id: "3", type: "account", data: { label: "ACC-3384", name: "Trade Co", risk: "medium", balance: "$890K" }, position: { x: 150, y: 300 } },
  { id: "4", type: "account", data: { label: "ACC-5519", name: "Dormant Acct", risk: "medium", balance: "$450K" }, position: { x: 450, y: 350 } },
  { id: "5", type: "account", data: { label: "ACC-1193", name: "Retail Bank", risk: "low", balance: "$3.2M" }, position: { x: 50, y: 150 } },
  { id: "6", type: "account", data: { label: "ACC-6647", name: "Crypto Exchange", risk: "high", balance: "$5.1M" }, position: { x: 650, y: 50 } },
];

export const graphEdges = [
  { id: "e1-2", source: "1", target: "2", data: { amount: "$142,500", date: "2024-03-15" }, animated: true },
  { id: "e2-3", source: "2", target: "3", data: { amount: "$98,000", date: "2024-03-15" } },
  { id: "e3-1", source: "3", target: "1", data: { amount: "$135,000", date: "2024-03-16" }, animated: true },
  { id: "e1-4", source: "1", target: "4", data: { amount: "$67,200", date: "2024-03-14" } },
  { id: "e5-1", source: "5", target: "1", data: { amount: "$210,000", date: "2024-03-13" } },
  { id: "e2-6", source: "2", target: "6", data: { amount: "$89,000", date: "2024-03-16" }, animated: true },
];

export const copilotPresets: Record<string, string> = {
  "What is FIU and what does it do?":
    "The **Financial Intelligence Unit (FIU)** is a government body that collects, analyzes, and shares financial data to combat money laundering and terrorist financing.\n\nIn India, **FIU-IND** operates under the Ministry of Finance. They receive:\n- 📋 **Suspicious Transaction Reports (STRs)** from banks\n- 💵 **Cash Transaction Reports (CTRs)** from financial institutions\n\nOur platform generates **FIU-compliant reports** that you can directly submit.",

  "How does your fraud detection system work?":
    "Our system uses a **hybrid AI approach**:\n\n1. 🔗 **Graph Construction** — Every account is a node, every transaction is a directed edge\n2. 🧮 **Rule Engine** — Pattern rules detect structuring, layering, circular flows\n3. 🤖 **ML Layer** — Anomaly detection models score transactions\n4. 📊 **Risk Scoring** — Each account gets a Low/Medium/High risk score\n5. 🔍 **Investigator Tools** — Drill down into any flagged path interactively",

  "What is layering in money laundering?":
    "**Layering** is the second stage of money laundering where criminals create complex layers of financial transactions to distance funds from their illegal source.\n\n**How it works:**\n- 💸 Funds are moved rapidly through multiple accounts\n- 🌍 Often involves cross-border transfers\n- 🏦 Uses shell companies and intermediaries\n- ⏱️ Transactions happen in quick succession\n\nOur system detects layering by analyzing **transaction velocity** and **hop patterns** in the fund flow graph.",

  "Why is this account flagged as high risk?":
    "An account is flagged as **high risk** when multiple risk indicators converge:\n\n🔴 **Behavioral Signals:**\n- Unusual transaction volume spikes\n- Connections to known suspicious entities\n- Transactions just below reporting thresholds\n\n🔴 **Network Signals:**\n- High centrality in suspicious subgraphs\n- Part of circular transaction chains\n- Links to dormant accounts that recently activated\n\nCheck the **Risk Score Breakdown** panel for the specific factors.",

  "Explain circular transactions":
    "**Circular transactions** (round-tripping) occur when funds flow in a loop:\n\n```\nA → B → C → A\n```\n\n**Purpose:** To create an illusion of legitimate business activity or inflate revenue.\n\n**Detection:** Our graph algorithms identify cycles in the transaction network and flag them based on:\n- 🔄 Cycle length and frequency\n- 💰 Amount consistency across the chain\n- ⏱️ Time gaps between transfers",

  "How do I generate an investigation report?":
    "To generate an **FIU-compliant investigation report**:\n\n1. 📁 Navigate to the **Reports** page\n2. 🔍 Select the case or flagged accounts\n3. 📊 Review the auto-populated sections:\n   - Executive Summary\n   - Accounts Involved\n   - Transaction Chain\n   - Fraud Pattern Detected\n   - Risk Assessment\n   - Timeline of Events\n4. ✏️ Add investigator notes\n5. 📄 Click **Generate PDF**\n\nThe report follows FIU-IND format standards.",
};
