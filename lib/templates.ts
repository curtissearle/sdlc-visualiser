import { SDLCDiagram, SDLCNode } from './types';
import basicSdlcJson from './templates/basic-sdlc.json';
import waterfallJson from './templates/waterfall.json';
import scrumJson from './templates/scrum.json';
import kanbanJson from './templates/kanban.json';
import dualTrackJson from './templates/dual-track.json';
import { TemplateFile, zTemplateFile } from './template-schema';
import { getLayoutedElements } from './layout';
import { Node, Edge } from 'reactflow';

// Validate template JSON files at module load time so errors surface early
const rawTemplates = [
  basicSdlcJson,
  waterfallJson,
  scrumJson,
  kanbanJson,
  dualTrackJson
];

const templateDefinitions: TemplateFile[] = rawTemplates.map((tmpl) =>
  zTemplateFile.parse(tmpl)
);

/**
 * Calculate node positions from edges if positions are missing.
 * Uses dagre layout algorithm to automatically position nodes based on their connections.
 */
function calculatePositionsFromEdges(
  nodes: SDLCNode[],
  edges: { fromNodeId: string; toNodeId: string }[]
): SDLCNode[] {
  // Check if all nodes already have positions
  if (nodes.every((node) => node.position)) {
    return nodes;
  }

  // Convert to React Flow format for layout calculation
  const reactFlowNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position || { x: 0, y: 0 }, // Temporary position
    data: {
      nodeType: node.type,
      title: node.title,
      description: node.description || '',
      tags: node.tags || [],
      toolKind: node.toolKind,
      toolId: node.toolId,
      attachedTools: node.attachedTools || [],
    },
  }));

  const reactFlowEdges: Edge[] = edges.map((edge, index) => ({
    id: `edge-${index}`,
    source: edge.fromNodeId,
    target: edge.toNodeId,
  }));

  // Calculate layout using Dagre in a left-to-right, mostly linear fashion.
  // We intentionally avoid any circular layout refinement so workflows with
  // feedback loops still appear as a readable linear flow.
  const { nodes: layoutedNodes } = getLayoutedElements(
    reactFlowNodes,
    reactFlowEdges,
    'LR'
  );

  // Map calculated positions back to SDLC nodes
  return nodes.map((node) => {
    const layoutedNode = layoutedNodes.find((n) => n.id === node.id);
    return {
      ...node,
      position: layoutedNode?.position || { x: 0, y: 0 },
    };
  });
}

export const templates: Record<string, SDLCDiagram> = {};
export const templateNames: Record<string, string> = {};

for (const tmpl of templateDefinitions) {
  // Calculate positions from edges if missing
  const nodesWithPositions = calculatePositionsFromEdges(tmpl.nodes, tmpl.edges);
  
  templates[tmpl.id] = {
    version: tmpl.version,
    nodes: nodesWithPositions,
    edges: tmpl.edges,
  };
  templateNames[tmpl.id] = tmpl.name;
}

// Optional: export full template metadata for future usage
export { templateDefinitions };

