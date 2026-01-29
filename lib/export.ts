import { SDLCDiagram } from './types';

// Export JSON
export function exportJSON(diagram: SDLCDiagram): void {
  const json = JSON.stringify(diagram, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sdlc-diagram.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import JSON
export function importJSON(file: File): Promise<SDLCDiagram> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const diagram = JSON.parse(content) as SDLCDiagram;

        // Basic validation
        if (!diagram.nodes || !diagram.edges || !Array.isArray(diagram.nodes) || !Array.isArray(diagram.edges)) {
          throw new Error('Invalid diagram format');
        }

        // Ensure version
        if (!diagram.version) {
          diagram.version = '1.0';
        }

        resolve(diagram);
      } catch (error) {
        reject(new Error('Failed to parse JSON file: ' + (error instanceof Error ? error.message : 'Unknown error')));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

