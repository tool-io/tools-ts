import { bodyMassIndexTool } from './body-mass-index/index.js';
import type { ToolDefinition } from './core/definition.js';

export type RegisteredTool = ToolDefinition<unknown, unknown>;

export const toolRegistry = new Map<string, RegisteredTool>([
  [bodyMassIndexTool.id, bodyMassIndexTool]
]);

export const getTool = (
  id: string
): RegisteredTool | undefined => toolRegistry.get(id);
