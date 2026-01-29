'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  UploadIcon,
  FileArrowDownIcon,
  LayoutIcon,
} from '@phosphor-icons/react';
import { exportJSON, importJSON } from '@/lib/export';
import { SDLCDiagram } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ToolbarProps {
  diagram: SDLCDiagram;
  onDiagramLoad: (diagram: SDLCDiagram) => void;
  onAutoLayout: () => void;
  onNewDiagram?: () => void;
  className?: string;
}

export function Toolbar({
  diagram,
  onDiagramLoad,
  onAutoLayout,
  onNewDiagram,
  className,
}: ToolbarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    exportJSON(diagram);
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedDiagram = await importJSON(file);
        onDiagramLoad(importedDiagram);
      } catch (error) {
        console.error('Failed to import JSON:', error);
        alert('Failed to import JSON file. Please check the file format.');
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 border-t border-border bg-background p-2',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {onNewDiagram && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm">
                New diagram
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>Start a new diagram?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear the current canvas and its saved state. You can&apos;t undo this action.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={onNewDiagram}
                >
                  Yes, start new
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportJSON}
          disabled={diagram.nodes.length === 0}
        >
          <FileArrowDownIcon className="mr-2 size-4" />
          Download JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleImportJSON}
        >
          <UploadIcon className="mr-2 size-4" />
          Upload JSON
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={onAutoLayout}
          disabled={diagram.nodes.length === 0}
        >
          <LayoutIcon className="mr-2 size-4" />
          Auto-layout
        </Button>
      </div>
      <div className="ml-auto text-xs text-muted-foreground">
        <kbd className="px-1.5 py-0.5 rounded border bg-muted">N</kbd> Stage{' '}
        <kbd className="px-1.5 py-0.5 rounded border bg-muted">G</kbd> Gate{' '}
        <kbd className="px-1.5 py-0.5 rounded border bg-muted">A</kbd> Artifact{' '}
        <kbd className="px-1.5 py-0.5 rounded border bg-muted">Del</kbd> Delete
      </div>
    </div>
  );
}

