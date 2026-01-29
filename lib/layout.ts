import dagre from 'dagre';
import { Node, Edge } from 'reactflow';

// These base dimensions should roughly match the visual size of the cards
// rendered by the node components. If they are too small, Dagre will pack
// ranks too tightly which can cause nodes to visually overlap when the
// actual React components are taller/wider than Dagre expects.
const BASE_NODE_WIDTH = 260;
const BASE_NODE_HEIGHT = 150;

// Rough heuristics per node type. This doesn't need to be perfect – just
// "large enough" so that diagrams with more content (e.g. many tags or
// attached tools) get extra breathing room in the layout.
type NodeDimensions = { width: number; height: number };

const NODE_DIMENSIONS_BY_TYPE: Record<string, NodeDimensions> = {
  stage: { width: 280, height: 180 },
  gate: { width: 240, height: 160 },
  artifact: { width: 240, height: 150 },
  tool: { width: 220, height: 130 },
};

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'LR' | 'TB' = 'LR'
) {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Slightly larger separation so multi‑row / dense templates do not
  // visually overlap, even when cards grow due to long descriptions or
  // many tags.
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 70,
    ranksep: 150,
  });

  nodes.forEach((node) => {
    const typeKey =
      // Prefer the semantic node type stored in data if available.
      (node.data as { nodeType?: string } | undefined)?.nodeType ??
      node.type ??
      'default';

    const dims = NODE_DIMENSIONS_BY_TYPE[typeKey] ?? {
      width: BASE_NODE_WIDTH,
      height: BASE_NODE_HEIGHT,
    };

    dagreGraph.setNode(node.id, { width: dims.width, height: dims.height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const typeKey =
      (node.data as { nodeType?: string } | undefined)?.nodeType ??
      node.type ??
      'default';

    const dims = NODE_DIMENSIONS_BY_TYPE[typeKey] ?? {
      width: BASE_NODE_WIDTH,
      height: BASE_NODE_HEIGHT,
    };

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - dims.width / 2,
        y: nodeWithPosition.y - dims.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

/**
 * Arrange a subset of nodes in a circular layout.
 *
 * - If `cycleNodeIds` is provided, only those nodes are arranged on the circle
 *   and other nodes keep their existing positions.
 * - The circle is centred on the centroid of the participating nodes'
 *   current positions so it plays nicely with an existing Dagre layout.
 */
export function getCircularLayout(
  nodes: Node[],
  edges: Edge[],
  cycleNodeIds?: string[]
) {
  const nodeById = new Map(nodes.map((n) => [n.id, n]));

  const targetNodes: Node[] =
    cycleNodeIds && cycleNodeIds.length > 0
      ? cycleNodeIds
          .map((id) => nodeById.get(id))
          .filter((n): n is Node => Boolean(n))
      : nodes;

  if (targetNodes.length === 0) {
    return { nodes, edges };
  }

  // Derive a sensible centre from existing positions, falling back to (0, 0)
  const { centerX, centerY } = targetNodes.reduce(
    (acc, node, index) => {
      const x = node.position?.x ?? 0;
      const y = node.position?.y ?? 0;
      const count = index + 1;

      return {
        centerX: acc.centerX + (x - acc.centerX) / count,
        centerY: acc.centerY + (y - acc.centerY) / count,
      };
    },
    { centerX: 0, centerY: 0 }
  );

  const count = targetNodes.length;
  const radius = Math.max(220, count * 60);
  const angleStep = (2 * Math.PI) / count;

  const positionedIds = new Set<string>();

  const circularNodes = targetNodes.map((node, index) => {
    const angle = index * angleStep;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    positionedIds.add(node.id);

    return {
      ...node,
      position: { x, y },
    };
  });

  const circularById = new Map(circularNodes.map((n) => [n.id, n]));

  const mergedNodes = nodes.map((node) => circularById.get(node.id) ?? node);

  return { nodes: mergedNodes, edges };
}
