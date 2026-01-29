import { NextRequest } from 'next/server';
import { templateFileJsonSchema } from '@/lib/template-schema';
import { toolCatalog } from '@/lib/tool-catalog';

// This route is fully static so it can be emitted at build time for static export.
export const dynamic = 'force-static';

export function GET(_req: NextRequest) {
  const body = {
    schemaVersion: '1.0',
    description: 'JSON Schema for SDLC template files consumed by the SDLC Visualiser.',
    templateSchema: templateFileJsonSchema,
    tools: toolCatalog,
  };

  return Response.json(body, {
    headers: {
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}


