'use client';

import { NodeProps, Handle, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { GitBranch, GitMerge, CloudArrowDown, Gauge } from '@phosphor-icons/react';
import { ToolKind } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ToolNodeData {
  nodeType: 'tool';
  title: string;
  description?: string;
  tags: string[];
  toolKind?: ToolKind;
  toolId?: string;
}

function getToolLabel(kind?: ToolKind, id?: string) {
  if (id === 'gitlab') return 'SCM';
  if (id === 'argocd') return 'CD';

  switch (kind) {
    case 'scm':
      return 'SCM';
    case 'ci':
      return 'CI';
    case 'cd':
      return 'CD';
    case 'observability':
      return 'Observability';
    default:
      return 'Tool';
  }
}

function getToolIcon(kind?: ToolKind, id?: string) {
  if (id === 'gitlab') return <GitBranch className="size-4 text-primary" />;
  if (id === 'argocd') return <CloudArrowDown className="size-4 text-primary" />;

  switch (kind) {
    case 'scm':
      return <GitBranch className="size-4 text-primary" />;
    case 'ci':
      return <GitMerge className="size-4 text-primary" />;
    case 'cd':
      return <CloudArrowDown className="size-4 text-primary" />;
    case 'observability':
      return <Gauge className="size-4 text-primary" />;
    default:
      return <GitBranch className="size-4 text-primary" />;
  }
}

export function ToolNode({ data, selected }: NodeProps<ToolNodeData>) {
  const toolLabel = getToolLabel(data.toolKind, data.toolId);

  return (
    <div
      className={cn(
        'min-w-[180px] rounded-full border-2 bg-background px-4 py-2 shadow-sm transition-all',
        'flex items-center gap-3',
        selected ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary" />

      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
          {getToolIcon(data.toolKind, data.toolId)}
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{data.title}</span>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
              {toolLabel}
            </Badge>
          </div>
          {data.description && (
            <p className="max-w-xs text-xs text-muted-foreground line-clamp-2">
              {data.description}
            </p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}


