'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { FileTextIcon } from '@phosphor-icons/react';
import { NodeType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ArtifactNodeData {
  nodeType: NodeType;
  title: string;
  description?: string;
  tags: string[];
}

export function ArtifactNode({ data, selected }: NodeProps<ArtifactNodeData>) {
  return (
    <div
      className={cn(
        'min-w-[180px] rounded-lg border-2 bg-background p-3 shadow-sm transition-all',
        selected
          ? 'border-primary shadow-md'
          : 'border-border hover:border-primary/50'
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileTextIcon className="size-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">{data.title}</h3>
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {data.description}
          </p>
        )}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  );
}

