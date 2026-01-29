'use client';

import { Handle, Position, NodeProps } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { NodeType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GateNodeData {
  nodeType: NodeType;
  title: string;
  description?: string;
  tags: string[];
}

export function GateNode({ data, selected }: NodeProps<GateNodeData>) {
  return (
    <div className="relative min-w-[200px] min-h-[120px]">
      <div
        className={cn(
          'absolute inset-0 border-2 bg-background shadow-sm transition-all',
          selected
            ? 'border-primary shadow-md'
            : 'border-border hover:border-primary/50'
        )}
        style={{
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary"
        style={{ left: '-4px', top: '50%' }}
      />
      <div className="relative flex h-full items-center justify-center p-3">
        <div className="space-y-1 text-center">
          <div className="flex items-center justify-between gap-2 text-left">
            <h3 className="font-semibold text-sm">{data.title}</h3>
            <span className="text-xs text-muted-foreground">Gate</span>
          </div>
          {data.description && (
            <p className="text-xs text-muted-foreground">
              {data.description}
            </p>
          )}
          {data.tags.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center justify-center gap-1">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary"
        style={{ right: '-4px', top: '50%' }}
      />
    </div>
  );
}

