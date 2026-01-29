import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

/**
 * Zod schemas for SDLC template JSON files.
 *
 * Authoring a new template:
 * - Place a file under `lib/templates/<id>.json`
 * - Shape must match `zTemplateFile`:
 *   - `id`: unique string key (used in code)
 *   - `name`: human-readable display name
 *   - `description` (optional): short blurb
 *   - `version`: string (e.g. "1.0")
 *   - `nodes`: array of SDLC nodes
 *   - `edges`: array of SDLC edges
 *
 * Allowed node types: "stage" | "gate" | "artifact" | "tool"
 * Allowed tool categories: "scm" | "ci" | "cd" | "observability" |
 *   "issue-tracking" | "feature-flags" | "infra" | "qa" | "other"
 */

// String unions mirroring NodeType and ToolCategory from ./types
export const zNodeType = z.union([
  z.literal('stage'),
  z.literal('gate'),
  z.literal('artifact'),
  z.literal('tool'),
]);

export const zToolCategory = z.union([
  z.literal('scm'),
  z.literal('ci'),
  z.literal('cd'),
  z.literal('observability'),
  z.literal('issue-tracking'),
  z.literal('feature-flags'),
  z.literal('infra'),
  z.literal('qa'),
  z.literal('other'),
]);

export const zAttachedTool = z.object({
  id: z.string(),
  toolId: z.string(),
  category: zToolCategory,
  displayName: z.string().optional(),
});

export const zPosition = z.object({
  x: z.number(),
  y: z.number(),
});

export const zSDLCNode = z.object({
  id: z.string(),
  type: zNodeType,
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  position: zPosition.optional(),
  toolKind: zToolCategory.optional(),
  toolId: z.string().optional(),
  attachedTools: z.array(zAttachedTool).optional(),
});

export const zSDLCEdge = z.object({
  id: z.string(),
  fromNodeId: z.string(),
  toNodeId: z.string(),
  label: z.string().optional(),
  type: z.string().optional(),
});

export const zSDLCDiagram = z.object({
  version: z.string(),
  nodes: z.array(zSDLCNode),
  edges: z.array(zSDLCEdge),
});

export const zTemplateFile = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  version: z.string(),
  nodes: z.array(zSDLCNode),
  edges: z.array(zSDLCEdge),
});

export type TemplateFile = z.infer<typeof zTemplateFile>;

/**
 * JSON Schema for SDLC template files, derived from `zTemplateFile`.
 *
 * This is used by the `/api/templates/schema` endpoint so that tools and LLMs
 * can reliably author new template JSON documents.
 */
export const templateFileJsonSchema = zodToJsonSchema(zTemplateFile, {
  name: 'SDLC_Template_File',
}) as unknown;




