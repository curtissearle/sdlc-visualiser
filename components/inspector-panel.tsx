'use client';

import { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { TrashIcon, PlusIcon, XIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import { ToolCategory, AttachedTool } from '@/lib/types';
import { getToolById, toolCatalog } from '@/lib/tool-catalog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface InspectorPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: Partial<Node['data']>) => void;
  onDeleteNode: (nodeId: string) => void;
}

export function InspectorPanel({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
}: InspectorPanelProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [attachedTools, setAttachedTools] = useState<AttachedTool[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | ''>('');
  const [selectedToolId, setSelectedToolId] = useState<string>('');
  const [customToolName, setCustomToolName] = useState<string>('');

  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.data.title || '');
      setDescription(selectedNode.data.description || '');
      setTags(selectedNode.data.tags || []);
      setAttachedTools(selectedNode.data.attachedTools || []);
      setSelectedCategory('');
      setSelectedToolId('');
      setCustomToolName('');
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return null;
  }

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        title,
        description,
        tags,
      });
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      if (selectedNode) {
        onUpdateNode(selectedNode.id, { tags: updatedTags });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, { tags: updatedTags });
    }
  };

  const handleDelete = () => {
    if (selectedNode) {
      onDeleteNode(selectedNode.id);
    }
  };

  const handleDetachTool = (attachedId: string) => {
    if (!selectedNode) return;
    const updated = attachedTools.filter((t) => t.id !== attachedId);
    setAttachedTools(updated);
    onUpdateNode(selectedNode.id, { attachedTools: updated });
  };

  const toolsForCategory = selectedCategory ? toolCatalog[selectedCategory] ?? [] : [];
  const canAttachFromCatalog =
    !!selectedNode &&
    (selectedNode.data.nodeType === 'stage' || selectedNode.data.nodeType === 'gate') &&
    !!selectedCategory &&
    !!selectedToolId;
  const canAttachCustom =
    !!selectedNode &&
    (selectedNode.data.nodeType === 'stage' || selectedNode.data.nodeType === 'gate') &&
    !!selectedCategory &&
    !!customToolName.trim();

  const handleAttachTool = () => {
    if (!selectedNode || !selectedCategory) return;
    const existing = attachedTools;
    let newAttached: AttachedTool | null = null;

    if (selectedToolId && selectedToolId !== 'custom') {
      // Attach from catalog
      newAttached = {
        id: `${selectedToolId}-${Date.now()}`,
        toolId: selectedToolId,
        category: selectedCategory,
      };
    } else if (selectedToolId === 'custom' && customToolName.trim()) {
      // Attach custom tool (not in catalog)
      const slug = customToolName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      newAttached = {
        id: `${slug}-${Date.now()}`,
        toolId: slug,
        category: selectedCategory,
        displayName: customToolName.trim(),
      };
    }

    if (!newAttached) return;

    const updated = [...existing, newAttached];
    setAttachedTools(updated);
    onUpdateNode(selectedNode.id, { attachedTools: updated });
    // reset tool selection but keep category to allow rapid multiple attaches
    setSelectedToolId('');
    setCustomToolName('');
  };

  return (
    <div className="flex h-full w-64 flex-col border-l border-border bg-muted/30">
      <Card className="m-4 border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Node Properties</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
              {selectedNode.data.nodeType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="node-title">Title</FieldLabel>
              <Input
                id="node-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                placeholder="Node title"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="node-description">Description</FieldLabel>
              <Textarea
                id="node-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleSave}
                placeholder="Node description"
                rows={3}
              />
            </Field>
            <Field>
              <FieldLabel>Tags</FieldLabel>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Add tag"
                />
                <Button
                  type="button"
                  size="icon"
                  onClick={handleAddTag}
                  variant="outline"
                >
                  <PlusIcon className="size-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 rounded-full hover:bg-muted"
                      >
                        <XIcon className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </Field>

            {(selectedNode.data.nodeType === 'stage' ||
              selectedNode.data.nodeType === 'gate') && (
              <Field>
                <FieldLabel>Attached tools</FieldLabel>
                <div className="space-y-2">
                  <div className="flex flex-col gap-2">
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) =>
                        setSelectedCategory(value as ToolCategory)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tool type (SCM, CI, CD...)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scm">SCM</SelectItem>
                        <SelectItem value="ci">CI</SelectItem>
                        <SelectItem value="cd">CD</SelectItem>
                        <SelectItem value="observability">Observability</SelectItem>
                        <SelectItem value="issue-tracking">Issue Tracking</SelectItem>
                        <SelectItem value="feature-flags">Feature Flags</SelectItem>
                        <SelectItem value="infra">Infra / IaC</SelectItem>
                        <SelectItem value="qa">QA / Testing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedToolId}
                      onValueChange={(value) => {
                        setSelectedToolId(value);
                        if (value !== 'custom') {
                          setCustomToolName('');
                        }
                      }}
                      disabled={!selectedCategory}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            selectedCategory ? 'Select tool' : 'Select tool type first'
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {toolsForCategory.map((tool) => (
                          <SelectItem key={tool.id} value={tool.id}>
                            {tool.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom…</SelectItem>
                      </SelectContent>
                    </Select>
                    {selectedCategory && selectedToolId === 'custom' && (
                      <Input
                        placeholder="Enter custom tool name"
                        value={customToolName}
                        onChange={(e) => setCustomToolName(e.target.value)}
                      />
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!canAttachFromCatalog && !canAttachCustom}
                      onClick={handleAttachTool}
                    >
                      Attach tool
                    </Button>
                  </div>
                  {attachedTools.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      No tools attached yet. Attach SCM/CI/CD/QA tools relevant to this stage.
                    </p>
                  ) : (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {attachedTools.map((attached) => {
                        const tool = getToolById(attached.toolId);
                        const label = tool ? tool.name : attached.toolId;
                        return (
                          <Badge
                            key={attached.id}
                            variant="outline"
                            className="flex items-center gap-1 text-[11px]"
                          >
                            {label}{' '}
                            <span className="uppercase text-[10px] text-muted-foreground">
                              {attached.category}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDetachTool(attached.id)}
                              className="ml-1 rounded-full hover:bg-muted"
                            >
                              <XIcon className="size-3" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </Field>
            )}
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}

