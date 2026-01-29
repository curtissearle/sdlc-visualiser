'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  PlayIcon,
  ShieldCheckIcon,
  FileTextIcon,
} from '@phosphor-icons/react';
import { NodeType } from '@/lib/types';
import { templateNames } from '@/lib/templates';

interface PalettePanelProps {
  onAddNode: (type: NodeType) => void;
  onLoadTemplate: (templateId: string) => void;
}

export function PalettePanel({
  onAddNode,
  onLoadTemplate,
}: PalettePanelProps) {
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-muted/30">
      <div className="p-4 space-y-6">
        <div>
          <h2 className="mb-2 text-lg font-semibold">Components</h2>
          <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddNode('stage')}
          >
            <PlayIcon className="mr-2 size-4" />
            Add Stage
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddNode('gate')}
          >
            <ShieldCheckIcon className="mr-2 size-4" />
            Add Gate
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAddNode('artifact')}
          >
            <FileTextIcon className="mr-2 size-4" />
            Add Artifact
          </Button>
          </div>
        </div>

        {/* Tool attachment has been moved into the node inspector panel */}
      </div>

      <div className="border-t border-border p-4">
        <h2 className="mb-4 text-lg font-semibold">Templates</h2>
        <p className="mt-2 text-xs text-muted-foreground">
          Start from a pre-built SDLC template
        </p>
        <div className="space-y-2">
          {Object.entries(templateNames).map(([id, name]) => (
            <Button
              key={id}
              variant="ghost"
              className={`w-full justify-start text-sm ${
                selectedTemplateId === id ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={() => {
                setSelectedTemplateId(id);
                onLoadTemplate(id);
              }}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-border p-4 text-xs text-muted-foreground">
        <p className="mb-1 font-medium text-foreground">Schema endpoint</p>
        <a
          href="/api/templates/schema.json"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2 hover:text-primary break-all"
        >
          /api/templates/schema.json
        </a>
      </div>
    </div>
  );
}
