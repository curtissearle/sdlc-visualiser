'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Node, Edge, Connection, useNodesState, useEdgesState } from 'reactflow';
import { SDLCCanvas, createNode, convertToReactFlow } from '@/components/sdlc-canvas';
import { PalettePanel } from '@/components/palette-panel';
import { InspectorPanel } from '@/components/inspector-panel';
import { Toolbar } from '@/components/toolbar';
import { NodeType, SDLCDiagram, ToolCategory, AttachedTool } from '@/lib/types';
import { templates } from '@/lib/templates';
import { convertToSDLCDiagram } from '@/lib/diagram';
import { getLayoutedElements } from '@/lib/layout';
import { validateDiagram } from '@/lib/validation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayIcon } from '@phosphor-icons/react';

const LOCAL_STORAGE_KEY = 'sdlc-visualiser-diagram-v1';

export default function Page() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hasLoadedInitialDiagramRef = useRef(false);

  // Save state to history for undo/redo
  const saveToHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ nodes: [...newNodes], edges: [...newEdges] });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  // Helper to generate unique node IDs when merging templates
  const generateUniqueNodeIds = useCallback(
    (
      templateNodes: Node[],
      existingNodes: Node[]
    ): { remappedNodes: Node[]; idMap: Map<string, string> } => {
      const existingIds = new Set(existingNodes.map((n) => n.id));
      const idMap = new Map<string, string>();

      const remappedNodes = templateNodes.map((node, index) => {
        const baseId = node.id || `template-node-${index}`;
        let newId = baseId;
        let counter = 1;

        while (existingIds.has(newId)) {
          newId = `${baseId}-${counter++}`;
        }

        existingIds.add(newId);
        idMap.set(node.id, newId);

        return {
          ...node,
          id: newId,
        };
      });

      return { remappedNodes, idMap };
    },
    []
  );

  // Helper to offset positions of new nodes so they appear to the right of existing content
  const offsetTemplateNodePositions = useCallback((templateNodes: Node[], existingNodes: Node[]) => {
    if (!existingNodes.length) {
      return templateNodes;
    }

    const maxY = Math.max(...existingNodes.map((n) => n.position.y));
    const offsetY = maxY + 200;

    return templateNodes.map((node) => ({
      ...node,
      position: {
        x: node.position?.x ?? 0,
        y: (node.position?.y ?? 0) + offsetY,
      },
    }));
  }, []);

  // Load persisted diagram on first mount or initialize empty history
  useEffect(() => {
    if (hasLoadedInitialDiagramRef.current) return;

    hasLoadedInitialDiagramRef.current = true;

    if (typeof window === 'undefined') {
      // SSR safeguard – nothing to load
      if (nodes.length === 0 && edges.length === 0) {
        saveToHistory([], []);
      }
      return;
    }

    try {
      const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SDLCDiagram | null;
        if (parsed && Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
          const { nodes: loadedNodes, edges: loadedEdges } = convertToReactFlow(
            parsed.nodes,
            parsed.edges
          );
          setNodes(loadedNodes);
          setEdges(loadedEdges);
          setHistory([{ nodes: [...loadedNodes], edges: [...loadedEdges] }]);
          setHistoryIndex(0);
          setSelectedNode(null);
          return;
        }
      }
    } catch (error) {
      console.warn('Failed to load persisted diagram from localStorage:', error);
    }

    // Fallback: start with an empty diagram in history
    if (nodes.length === 0 && edges.length === 0) {
      saveToHistory([], []);
    }
  }, [nodes.length, edges.length, saveToHistory, setNodes, setEdges]);

  // Handle node click
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Handle pane click (deselect)
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Handle connection
  const handleConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const newEdge: Edge = {
          id: `e${edges.length}-${Date.now()}`,
          source: connection.source,
          target: connection.target,
          // Use the same custom SDLC edge as template/imported edges so
          // ad‑hoc connections also route cleanly around nodes.
          type: 'sdlc',
        };
        const newEdges = [...edges, newEdge];
        setEdges(newEdges);
        saveToHistory(nodes, newEdges);
      }
    },
    [nodes, edges, setEdges, saveToHistory]
  );

  // Add node
  const handleAddNode = useCallback(
    (type: NodeType) => {
      const position = {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      };
      const newNode = createNode(type, position);
      const newNodes = [...nodes, newNode];
      setNodes(newNodes);
      saveToHistory(newNodes, edges);
    },
    [nodes, edges, setNodes, saveToHistory]
  );

  // Attach tool to an existing node (stage/gate)
  const handleAttachToolToNode = useCallback(
    (nodeId: string, toolId: string, category: ToolCategory) => {
      const newNodes = nodes.map((node) => {
        if (node.id !== nodeId) return node;
        const existing: AttachedTool[] = node.data.attachedTools || [];
        const attached: AttachedTool = {
          id: `${toolId}-${Date.now()}`,
          toolId,
          category,
        };
        return {
          ...node,
          data: {
            ...node.data,
            attachedTools: [...existing, attached],
          },
        };
      });
      setNodes(newNodes);
      saveToHistory(newNodes, edges);
    },
    [nodes, edges, setNodes, saveToHistory]
  );

  // Update node
  const handleUpdateNode = useCallback(
    (nodeId: string, updates: Partial<Node['data']>) => {
      const newNodes = nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...updates } }
          : node
      );
      setNodes(newNodes);
      if (selectedNode?.id === nodeId) {
        setSelectedNode(newNodes.find((n) => n.id === nodeId) || null);
      }
      saveToHistory(newNodes, edges);
    },
    [nodes, edges, selectedNode, setNodes, saveToHistory]
  );

  // Delete node
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      const newNodes = nodes.filter((node) => node.id !== nodeId);
      const newEdges = edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      setNodes(newNodes);
      setEdges(newEdges);
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
      saveToHistory(newNodes, newEdges);
    },
    [nodes, edges, selectedNode, setNodes, setEdges, saveToHistory]
  );

  // Load template
  const handleLoadTemplate = useCallback(
    (templateId: string) => {
      const template = templates[templateId];
      if (!template) return;

      const { nodes: templateNodesRaw, edges: templateEdgesRaw } = convertToReactFlow(
        template.nodes,
        template.edges
      );

      // Offset template nodes so they appear as a separate cluster
      const offsetNodes = offsetTemplateNodePositions(templateNodesRaw, nodes);

      // Ensure unique IDs for nodes and update edges accordingly
      const { remappedNodes, idMap } = generateUniqueNodeIds(offsetNodes, nodes);

      const remappedEdges = templateEdgesRaw.map((edge, index) => {
        const source = idMap.get(edge.source) ?? edge.source;
        const target = idMap.get(edge.target) ?? edge.target;

        return {
          ...edge,
          id: `template-edge-${templateId}-${Date.now()}-${index}`,
          source,
          target,
        };
      });

      const mergedNodes = [...nodes, ...remappedNodes];
      const mergedEdges = [...edges, ...remappedEdges];

      setNodes(mergedNodes);
      setEdges(mergedEdges);
      saveToHistory(mergedNodes, mergedEdges);
      setSelectedNode(null);
    },
    [
      nodes,
      edges,
      setNodes,
      setEdges,
      saveToHistory,
      offsetTemplateNodePositions,
      generateUniqueNodeIds,
    ]
  );

  // Auto-layout
  const handleAutoLayout = useCallback(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    saveToHistory(layoutedNodes, layoutedEdges);
  }, [nodes, edges, setNodes, setEdges, saveToHistory]);

  // Load diagram (from JSON import)
  const handleDiagramLoad = useCallback(
    (diagram: SDLCDiagram) => {
      const { nodes: loadedNodes, edges: loadedEdges } = convertToReactFlow(
        diagram.nodes,
        diagram.edges
      );
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      saveToHistory(loadedNodes, loadedEdges);
      setSelectedNode(null);
    },
    [setNodes, setEdges, saveToHistory]
  );

  // Get current diagram for export / persistence
  const currentDiagram: SDLCDiagram = useMemo(() => {
    return convertToSDLCDiagram(nodes, edges);
  }, [nodes, edges]);

  const handleNewDiagram = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setHistory([{ nodes: [], edges: [] }]);
    setHistoryIndex(0);

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      } catch (error) {
        console.warn('Failed to clear persisted diagram from localStorage:', error);
      }
    }
  }, [setNodes, setEdges]);

  // Persist diagram to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      // Avoid writing completely empty diagrams unless history already started that way
      if (currentDiagram.nodes.length === 0 && currentDiagram.edges.length === 0) {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentDiagram));
    } catch (error) {
      console.warn('Failed to persist diagram to localStorage:', error);
    }
  }, [currentDiagram]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Undo/Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (historyIndex > 0) {
          const prevState = history[historyIndex - 1];
          setNodes(prevState.nodes);
          setEdges(prevState.edges);
          setHistoryIndex(historyIndex - 1);
          setSelectedNode(null);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          const nextState = history[historyIndex + 1];
          setNodes(nextState.nodes);
          setEdges(nextState.edges);
          setHistoryIndex(historyIndex + 1);
          setSelectedNode(null);
        }
      }
      // Add nodes
      else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        handleAddNode('stage');
      } else if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        handleAddNode('gate');
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleAddNode('artifact');
      }
      // Delete selected node
      else if (e.key === 'Delete' && selectedNode) {
        e.preventDefault();
        handleDeleteNode(selectedNode.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    history,
    historyIndex,
    selectedNode,
    handleAddNode,
    handleDeleteNode,
    setNodes,
    setEdges,
  ]);

  // Update selected node when nodes change
  useEffect(() => {
    if (selectedNode) {
      const updatedNode = nodes.find((n) => n.id === selectedNode.id);
      if (updatedNode) {
        setSelectedNode(updatedNode);
      } else {
        setSelectedNode(null);
      }
    }
  }, [nodes, selectedNode]);

  return (
    <div className="flex h-screen flex-col">
      <div className="flex flex-1 overflow-hidden">
        <PalettePanel
          onAddNode={handleAddNode}
          onLoadTemplate={handleLoadTemplate}
        />
        <div ref={canvasRef} className="relative flex-1">
          <SDLCCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onEdgesDelete={(deletedEdges) => {
              if (!deletedEdges.length) return;
              const deletedIds = new Set(deletedEdges.map((e) => e.id));
              const remainingEdges = edges.filter((e) => !deletedIds.has(e.id));
              // React Flow + useEdgesState already update the visual state;
              // we call saveToHistory so undo/redo captures edge deletions too.
              saveToHistory(nodes, remainingEdges);
            }}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
          />
        </div>
        <InspectorPanel
          selectedNode={selectedNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
        />
      </div>
      <Toolbar
        diagram={currentDiagram}
        onDiagramLoad={handleDiagramLoad}
        onAutoLayout={handleAutoLayout}
        onNewDiagram={handleNewDiagram}
      />
    </div>
  );
}
