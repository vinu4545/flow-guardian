import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Handle,
  Position,
  BackgroundVariant,
  MarkerType,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { graphNodes, graphEdges } from "@/lib/mockData";
import { getSuspiciousGraph } from "@/lib/api";
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

function FitViewOnUpdate({ version }: { version: number }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    fitView({ padding: 0.2, includeHiddenNodes: false, duration: 300 });
  }, [fitView, version]);

  return null;
}

type SuspiciousEdgePayload = {
  id: string | number;
  source: string;
  target: string;
  amount: string | number;
  alert?: string | null;
  isSuspicious?: boolean;
  risk_score?: number;
};

function layoutGraph(nodes: Node[], edges: Edge[]) {
  const incoming = new Map<string, number>();
  const outgoing = new Map<string, number>();
  const predecessors = new Map<string, string[]>();

  nodes.forEach((node) => {
    incoming.set(node.id, 0);
    outgoing.set(node.id, 0);
    predecessors.set(node.id, []);
  });

  edges.forEach((edge) => {
    incoming.set(edge.target, (incoming.get(edge.target) || 0) + 1);
    outgoing.set(edge.source, (outgoing.get(edge.source) || 0) + 1);
    predecessors.get(edge.target)?.push(edge.source);
  });

  const levels = new Map<string, number>();
  nodes.forEach((node) => {
    if ((incoming.get(node.id) || 0) === 0) {
      levels.set(node.id, 0);
    }
  });

  for (let pass = 0; pass < nodes.length; pass += 1) {
    let changed = false;
    nodes.forEach((node) => {
      const preds = predecessors.get(node.id) || [];
      if (preds.length === 0) return;
      const candidate = Math.max(...preds.map((pred) => (levels.get(pred) ?? 0) + 1));
      const current = levels.get(node.id);
      if (current == null || candidate > current) {
        levels.set(node.id, candidate);
        changed = true;
      }
    });
    if (!changed) break;
  }

  nodes.forEach((node) => {
    if (levels.get(node.id) == null) {
      const inCount = incoming.get(node.id) || 0;
      const outCount = outgoing.get(node.id) || 0;
      levels.set(node.id, Math.max(0, Math.min(2, outCount - inCount + 1)));
    }
  });

  const columns = new Map<number, Node[]>();
  nodes.forEach((node) => {
    const level = levels.get(node.id) || 0;
    if (!columns.has(level)) columns.set(level, []);
    columns.get(level)?.push(node);
  });

  const positionedNodes: Node[] = [];
  const horizontalGap = 260;
  const verticalGap = 170;
  const columnsPerRow = 3;

  [...columns.entries()]
    .sort(([a], [b]) => a - b)
    .forEach(([level, columnNodes]) => {
      const row = Math.floor(level / columnsPerRow);
      const column = level % columnsPerRow;
      columnNodes
        .sort((a, b) => String(a.id).localeCompare(String(b.id)))
        .forEach((node, index) => {
          positionedNodes.push({
            ...node,
            position: {
              x: column * horizontalGap,
              y: row * 260 + index * verticalGap,
            },
          });
        });
    });

  return positionedNodes;
}

export default function FundFlowPage() {
  const [graphVersion, setGraphVersion] = useState(0);
  const [nodes, setNodes] = useState<Node[]>(
    () =>
      graphNodes.map((n) => ({
        ...n,
        type: "account",
      }))
  );

  const [edges, setEdges] = useState<Edge[]>(
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
      }))
  );

  useEffect(() => {
    let mounted = true;
    getSuspiciousGraph()
      .then((data) => {
        if (!mounted || !data) return;

        const suspiciousSet = new Set<string>(data.edges.filter((ed: SuspiciousEdgePayload) => ed.isSuspicious).map((ed: SuspiciousEdgePayload) => `${ed.source}-${ed.target}-${ed.id}`));

        const nodeMap = new Map<string, Node>();
        data.nodes.forEach((n: any) => {
          nodeMap.set(n.id, {
            id: n.id,
            data: {
              label: n.label || n.id,
              name: n.holder_name || n.name || "Unknown account",
              risk: n.risk_score > 0.7 ? "high" : n.risk_score > 0.4 ? "medium" : "low",
              isSuspicious: false,
            },
            type: "account",
            position: { x: 0, y: 0 },
          });
        });

        const mappedEdges: Edge[] = data.edges.map((e: any) => {
          const edgeKey = `${e.source}-${e.target}-${e.id}`;
          const isSusp = !!e.isSuspicious || suspiciousSet.has(edgeKey);

          if (isSusp) {
            const sNode = nodeMap.get(e.source);
            const tNode = nodeMap.get(e.target);
            if (sNode) sNode.data = { ...sNode.data, isSuspicious: true };
            if (tNode) tNode.data = { ...tNode.data, isSuspicious: true };
          }

          const isCircular = e.alert === "circular";
          const isLayering = e.alert === "layering";
          const style: React.CSSProperties = {
            strokeWidth: isSusp ? 4 : 2,
            opacity: isSusp ? 1 : 0.18,
            stroke: isCircular
              ? "#ff3b3b"
              : isLayering
                ? "#ff9800"
                : isSusp
                  ? "#ff3b3b"
                  : "hsl(var(--muted-foreground))",
            strokeDasharray: isLayering ? "8 5" : undefined,
          };

          return {
            id: `e-${e.source}-${e.target}-${e.id}`,
            source: e.source,
            target: e.target,
            animated: isCircular || isLayering || isSusp,
            type: "default",
            markerEnd: { type: MarkerType.ArrowClosed, color: style.stroke as string },
            label: `\$${Number(e.amount).toLocaleString()}`,
            style,
            data: { alert: e.alert, isSuspicious: isSusp, amount: e.amount, risk: e.risk_score },
          } as Edge;
        });

        const layoutedNodes = layoutGraph(Array.from(nodeMap.values()), mappedEdges).map((node) => ({
          ...node,
          draggable: false,
        }));

        setNodes(layoutedNodes);
        setEdges(mappedEdges);
        setGraphVersion((current) => current + 1);
      })
      .catch((err) => console.error("Failed to load suspicious graph:", err));

    return () => {
      mounted = false;
    };
  }, []);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    console.log("Node clicked:", node);
  }, []);

  return (
    <motion.div {...pageTransition} className="h-[calc(100vh-0px)] flex flex-col">
      <div className="p-6 pb-3 space-y-3">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Fund Flow Graph</h1>
          <p className="text-sm text-muted-foreground">Dynamic endpoint data with clear fraud cues and a clean layout.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-500">Red edges = circular fraud</span>
          <span className="px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500">Orange dashed = layering</span>
          <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-500">Animated = money movement</span>
          <span className="px-3 py-1 rounded-full border border-muted-foreground/20 bg-muted/50 text-muted-foreground">Faded = irrelevant</span>
        </div>
      </div>

      <div className="flex-1 m-4 rounded-xl overflow-hidden border border-border bg-background/80">
        <ReactFlow
          key={graphVersion}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 0.2, includeHiddenNodes: false }}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: "default",
            markerEnd: { type: MarkerType.ArrowClosed },
          }}
          className="bg-background"
        >
          <FitViewOnUpdate version={graphVersion} />
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="hsl(var(--border))" />
          <Controls className="!bg-card !border-border !rounded-lg !shadow-lg [&_button]:!bg-card [&_button]:!border-border [&_button]:!text-foreground" />
        </ReactFlow>
      </div>
    </motion.div>
  );
}
