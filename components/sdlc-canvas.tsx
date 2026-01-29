'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  EdgeTypes,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { StageNode } from './nodes/stage-node';
import { GateNode } from './nodes/gate-node';
import { ArtifactNode } from './nodes/artifact-node';
import { SdlcEdge } from './sdlc-edge';
import { NodeType, ToolKind, AttachedTool } from '@/lib/types';
import { getLayoutedElements } from '@/lib/layout';

const nodeTypes: NodeTypes = {
  stage: StageNode,
  gate: GateNode,
  artifact: ArtifactNode,
};

const edgeTypes: EdgeTypes = {
  sdlc: SdlcEdge,
};

interface SDLCCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  onEdgesDelete?: (edges: Edge[]) => void;
  onNodeClick?: (event: React.MouseEvent, node: Node) => void;
  onPaneClick?: () => void;
}

export function SDLCCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onEdgesDelete,
  onNodeClick,
  onPaneClick,
}: SDLCCanvasProps) {
  const handleConnect = useCallback(
    (params: Connection) => {
      onConnect(params);
    },
    [onConnect]
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onEdgesDelete={onEdgesDelete}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        deleteKeyCode={['Delete', 'Backspace']}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        // Use the raw CSS variable so it works with the oklch-based theme tokens
        connectionLineStyle={{ stroke: 'var(--primary)', strokeWidth: 2 }}
        defaultEdgeOptions={{
          style: { stroke: 'var(--primary)', strokeWidth: 2 },
          // Use custom SDLC edges that keep forward edges tidy and route
          // backward / loop edges in a wide arc around the nodes.
          type: 'sdlc',
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.data?.nodeType) {
              case 'stage':
                return 'hsl(var(--primary))';
              case 'gate':
                return 'hsl(var(--destructive))';
              case 'artifact':
                return 'hsl(var(--secondary))';
              default:
                return '#ccc';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
      </ReactFlow>
    </div>
  );
}

// Helper function to create a new node
export function createNode(
  type: NodeType,
  position: { x: number; y: number },
  id?: string,
  extras?: { toolKind?: ToolKind; toolId?: string; title?: string; attachedTools?: AttachedTool[] }
): Node {
  const nodeId = id || `${type}-${Date.now()}`;
  let title = extras?.title;

  if (!title) {
    switch (type) {
      case 'stage':
        title = 'New Stage';
        break;
      case 'gate':
        title = 'New Gate';
        break;
      case 'artifact':
        title = 'New Artifact';
        break;
      case 'tool':
        title = 'New Tool';
        break;
      default:
        title = 'New Node';
    }
  }

  return {
    id: nodeId,
    type,
    position,
    data: {
      nodeType: type,
      title,
      description: '',
      tags: [],
      toolKind: extras?.toolKind,
      toolId: extras?.toolId,
      attachedTools: extras?.attachedTools ?? [],
    },
  };
}

// Helper function to convert SDLC diagram to React Flow format
export function convertToReactFlow(nodes: any[], edges: any[]): { nodes: Node[]; edges: Edge[] } {
  const reactFlowNodes: Node[] = nodes.map((node) => ({
    id: node.id,
    type: node.type,
    position: node.position || { x: 0, y: 0 }, // Default position if missing
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

  const reactFlowEdges: Edge[] = edges.map((edge) => ({
    id: edge.id,
    source: edge.fromNodeId,
    target: edge.toNodeId,
    label: edge.label,
    // Default to the custom SDLC edge so imported/template edges benefit from
    // the same routing behaviour as user‑created connections.
    type: edge.type ?? 'sdlc',
  }));

  return { nodes: reactFlowNodes, edges: reactFlowEdges };
}

