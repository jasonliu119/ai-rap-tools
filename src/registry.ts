/** A small manifest for sites that want to list the tools dynamically. */
export type ToolDefinition = {
  id: string;
  name: string;
  description: string;
  version: string;
  input: 'rap-name-options' | 'wu-tang-name-options';
};

export const tools: readonly ToolDefinition[] = [
  {
    id: 'rap-name',
    name: 'Rap Name Generator',
    description: 'Builds a varied pool of original rap-name ideas.',
    version: '1.0.0',
    input: 'rap-name-options',
  },
  {
    id: 'wu-tang-name',
    name: 'Wu-Tang-style Name Generator',
    description: 'Creates a deterministic, local alias and interpretation.',
    version: '1.0.0',
    input: 'wu-tang-name-options',
  },
];

export function getTool(id: string): ToolDefinition | undefined {
  return tools.find((tool) => tool.id === id);
}
