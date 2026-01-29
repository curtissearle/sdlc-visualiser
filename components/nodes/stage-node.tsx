'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { NodeType, AttachedTool } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getToolById } from '@/lib/tool-catalog';

interface StageNodeData {
  nodeType: NodeType;
  title: string;
  description?: string;
  tags: string[];
  attachedTools?: AttachedTool[];
}

export function StageNode({ data, selected }: NodeProps<StageNodeData>) {
  const tools = data.attachedTools || [];

  return (
    <div
      className={cn(
        'min-w-[200px] rounded-lg border-2 bg-background p-3 shadow-sm transition-all',
        selected
          ? 'border-primary shadow-md'
          : 'border-border hover:border-primary/50'
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-sm">{data.title}</h3>
          <span className="text-xs text-muted-foreground">Stage</span>
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {data.description}
          </p>
        )}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {tools.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1 border-t border-dashed border-border/60 pt-1">
            {tools.map((attached) => {
              const tool = getToolById(attached.toolId);
              const label =
                attached.displayName || tool?.name || attached.toolId;
              return (
                <Badge
                  key={attached.id}
                  variant="outline"
                  className="flex items-center gap-1 text-[10px]"
                >
                  {label}
                  <span className="uppercase text-[9px] text-muted-foreground">
                    {attached.category}
                  </span>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}


