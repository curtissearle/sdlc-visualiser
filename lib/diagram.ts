import { SDLCDiagram, SDLCNode, SDLCEdge } from './types';

// Convert React Flow nodes/edges to SDLC diagram format
export function convertToSDLCDiagram(nodes: any[], edges: any[]): SDLCDiagram {
  const sdlcNodes: SDLCNode[] = nodes.map((node) => ({
    id: node.id,
    type: node.data.nodeType,
    title: node.data.title,
    description: node.data.description,
    tags: node.data.tags || [],
    position: node.position,
    toolKind: node.data.toolKind,
    toolId: node.data.toolId,
    attachedTools: node.data.attachedTools || [],
  }));

  const sdlcEdges: SDLCEdge[] = edges.map((edge) => ({
    id: edge.id,
    fromNodeId: edge.source,
    toNodeId: edge.target,
    label: edge.label,
    type: edge.type,
  }));

  return {
    nodes: sdlcNodes,
    edges: sdlcEdges,
    version: '1.0',
  };
}


