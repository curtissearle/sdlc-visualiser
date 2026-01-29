import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { templateFileJsonSchema } from '../lib/template-schema';
import { toolCatalog } from '../lib/tool-catalog';

const body = {
  schemaVersion: '1.0',
  description: 'JSON Schema for SDLC template files consumed by the SDLC Visualiser.',
  templateSchema: templateFileJsonSchema,
  tools: toolCatalog,
};

// Ensure the directory exists
const outputDir = join(process.cwd(), 'public', 'api', 'templates');
mkdirSync(outputDir, { recursive: true });

// Write the JSON file
const outputPath = join(outputDir, 'schema.json');
writeFileSync(outputPath, JSON.stringify(body, null, 2), 'utf-8');

console.log(`✓ Generated static schema file at ${outputPath}`);
