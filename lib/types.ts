export type NodeType = 'stage' | 'gate' | 'artifact' | 'tool';

export type ToolCategory =
  | 'scm'
  | 'ci'
  | 'cd'
  | 'observability'
  | 'issue-tracking'
  | 'feature-flags'
  | 'infra'
  | 'qa'
  | 'other';

// Backwards-compat alias for earlier implementation
export type ToolKind = ToolCategory;

export interface ToolDefinition {
  id: string;
  name: string;
  category: ToolCategory;
  vendor?: string;
  url?: string;
}

export interface AttachedTool {
  id: string;
  toolId: string;
  category: ToolCategory;
  /**
   * Optional display name for custom tools not in the catalog.
   */
  displayName?: string;
}

export interface SDLCNode {
  id: string;
  type: NodeType;
  title: string;
  description?: string;
  tags: string[];
  position?: { x: number; y: number };
  /**
   * Optional metadata for tool nodes. Ignored for non-tool nodes.
   */
  toolKind?: ToolKind;
  toolId?: string;
  /**
   * Tools attached to this node (e.g. GitLab SCM, ArgoCD CD).
   */
  attachedTools?: AttachedTool[];
}

export interface SDLCEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  label?: string;
  type?: string;
}

export interface SDLCDiagram {
  nodes: SDLCNode[];
  edges: SDLCEdge[];
  version: string;
}

// React Flow node type (extends SDLCNode with React Flow requirements)
export interface ReactFlowNode {
  id: string;
  type: string;
  data: {
    nodeType: NodeType;
    title: string;
    description?: string;
    tags: string[];
    toolKind?: ToolKind;
    toolId?: string;
    attachedTools?: AttachedTool[];
  };
  position: { x: number; y: number };
}

// React Flow edge type
export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

