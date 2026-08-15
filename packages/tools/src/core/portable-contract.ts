import type { ToolContract, ToolDefinition } from "./definition.js";

/**
 * Return the serializable portion of an executable tool definition.
 * Property order is stable so generated artifacts and fingerprints remain
 * reproducible.
 */
export const portableToolContract = (
  definition: ToolDefinition<unknown, unknown>,
): ToolContract => ({
  contractVersion: definition.contractVersion,
  description: definition.description,
  ...(definition.discovery === undefined
    ? {}
    : { discovery: definition.discovery }),
  execution: definition.execution,
  id: definition.id,
  inputSchema: definition.inputSchema,
  outputSchema: definition.outputSchema,
  ports: definition.ports,
  title: definition.title,
});
