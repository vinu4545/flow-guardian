import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { graphNodes, graphEdges } from "@/lib/mockData";
import { RiskBadge } from "@/components/RiskBadge";

function AccountNode({ data }: { data: { label: string; name: string; risk: string; balance: string } }) {
  const riskColor =
    data.risk === "high" ? "border-destructive shadow-destructive/20" :
    data.risk === "medium" ? "border-warning shadow-warning/20" :
    "border-success shadow-success/20";

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`glass-card p-4 rounded-xl border-2 shadow-lg min-w-[160px] ${riskColor} ${data.risk === "high" ? "neon-glow" : ""}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary !w-2 !h-2" />
      <div className="text-center">
        <div className="font-mono text-xs text-muted-foreground mb-1">{data.label}</div>
        <div className="font-display font-semibold text-sm text-foreground">{data.name}</div>
        <div className="text-xs text-muted-foreground mt-1">{data.balance}</div>
        <div className="mt-2">
          <RiskBadge risk={data.risk as "low" | "medium" | "high"} pulse={data.risk === "high"} />
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary !w-2 !h-2" />
    </motion.div>
  );
}

const nodeTypes = { account: AccountNode };

export default function FundFlowPage() {
  const nodes: Node[] = useMemo(
    () =>
      graphNodes.map((n) => ({
        ...n,
        type: "account",
      })),
    []
  );

  const edges: Edge[] = useMemo(
    () =>
      graphEdges.map((e) => ({
        ...e,
        type: "default",
        animated: e.animated || false,
        style: { stroke: e.animated ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))", strokeWidth: 2 },
        label: e.data?.amount,
        labelStyle: { fill: "hsl(var(--foreground))", fontSize: 11, fontFamily: "JetBrains Mono" },
        labelBgStyle: { fill: "hsl(var(--card))", fillOpacity: 0.9 },
        labelBgPadding: [6, 4] as [number, number],
        labelBgBorderRadius: 4,
      })),
    []
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    console.log("Node clicked:", node);
  }, []);

  return (
    <motion.div {...pageTransition} className="h-[calc(100vh-0px)] flex flex-col">
      <div className="p-6 pb-0">
        <h1 className="text-2xl font-display font-bold text-foreground">Fund Flow Graph</h1>
        <p className="text-sm text-muted-foreground">Interactive visualization of money movement and suspicious paths</p>
      </div>

      <div className="flex-1 m-4 rounded-xl overflow-hidden border border-border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          className="bg-background"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--border))" />
          <Controls className="!bg-card !border-border !rounded-lg !shadow-lg [&_button]:!bg-card [&_button]:!border-border [&_button]:!text-foreground" />
          <MiniMap
            nodeColor={(n) => {
              const risk = n.data?.risk;
              if (risk === "high") return "hsl(0, 84%, 60%)";
              if (risk === "medium") return "hsl(38, 92%, 50%)";
              return "hsl(160, 84%, 39%)";
            }}
            className="!bg-card !border-border !rounded-lg"
          />
        </ReactFlow>
      </div>
    </motion.div>
  );
}
