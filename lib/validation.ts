import { SDLCDiagram } from './types';

export interface ValidationWarning {
  type: 'orphan-edge' | 'no-start' | 'no-end' | 'cycle';
  message: string;
  nodeIds?: string[];
  edgeIds?: string[];
}

export function validateDiagram(diagram: SDLCDiagram): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Check for orphan edges (edges pointing to non-existent nodes)
  const nodeIds = new Set(diagram.nodes.map((n) => n.id));
  const orphanEdges = diagram.edges.filter(
    (e) => !nodeIds.has(e.fromNodeId) || !nodeIds.has(e.toNodeId)
  );

  if (orphanEdges.length > 0) {
    warnings.push({
      type: 'orphan-edge',
      message: `Found ${orphanEdges.length} edge(s) pointing to non-existent nodes`,
      edgeIds: orphanEdges.map((e) => e.id),
    });
  }

  // Check for start nodes (nodes with no incoming edges)
  const nodesWithIncoming = new Set(
    diagram.edges.map((e) => e.toNodeId).filter((id) => nodeIds.has(id))
  );
  const structuralNodes = diagram.nodes.filter((n) => n.type !== 'tool');
  const startNodes = structuralNodes.filter((n) => !nodesWithIncoming.has(n.id));

  if (startNodes.length === 0 && structuralNodes.length > 0) {
    warnings.push({
      type: 'no-start',
      message: 'No start node found (all nodes have incoming edges)',
    });
  }

  // Check for end nodes (nodes with no outgoing edges)
  const nodesWithOutgoing = new Set(
    diagram.edges.map((e) => e.fromNodeId).filter((id) => nodeIds.has(id))
  );
  const endNodes = structuralNodes.filter((n) => !nodesWithOutgoing.has(n.id));

  if (endNodes.length === 0 && structuralNodes.length > 0) {
    warnings.push({
      type: 'no-end',
      message: 'No end node found (all nodes have outgoing edges)',
    });
  }

  // Detect cycles (informational warning)
  const cycles = detectCycles(diagram);
  if (cycles.length > 0) {
    warnings.push({
      type: 'cycle',
      message: `Found ${cycles.length} cycle(s) in the diagram`,
      nodeIds: cycles.flat(),
    });
  }

  return warnings;
}

// Detect cycles using DFS
function detectCycles(diagram: SDLCDiagram): string[][] {
  const cycles: string[][] = [];
  const nodeIds = new Set(diagram.nodes.map((n) => n.id));

  // Build adjacency list
  const adjList = new Map<string, string[]>();
  diagram.nodes.forEach((n) => adjList.set(n.id, []));
  diagram.edges.forEach((e) => {
    if (nodeIds.has(e.fromNodeId) && nodeIds.has(e.toNodeId)) {
      adjList.get(e.fromNodeId)?.push(e.toNodeId);
    }
  });

  const visited = new Set<string>();
  const recStack = new Set<string>();
  const path: string[] = [];

  function dfs(nodeId: string): void {
    if (recStack.has(nodeId)) {
      // Found a cycle
      const cycleStart = path.indexOf(nodeId);
      if (cycleStart !== -1) {
        cycles.push([...path.slice(cycleStart), nodeId]);
      }
      return;
    }

    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);
    recStack.add(nodeId);
    path.push(nodeId);

    const neighbors = adjList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      dfs(neighbor);
    }

    recStack.delete(nodeId);
    path.pop();
  }

  // Run DFS from each unvisited node
  for (const nodeId of nodeIds) {
    if (!visited.has(nodeId)) {
      dfs(nodeId);
    }
  }

  return cycles;
}

