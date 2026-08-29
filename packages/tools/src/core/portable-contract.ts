import type { ToolContract, ToolDefinition } from "./definition.js";

const presentationKinds = new Map<string, "chart" | "map" | "table">([
  ["tool.io/chart-document", "chart"],
  ["tool.io/map-document", "map"],
  ["tool.io/table", "table"],
  ["tool.io/table-document", "table"],
] as const);

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
  ports: {
    inputs: definition.ports.inputs,
    outputs: definition.ports.outputs.map((port) => {
      const kind =
        port.presentation?.kind ??
        (port.valueType.format
          ? presentationKinds.get(port.valueType.format)
          : undefined);
      return kind === undefined
        ? port
        : { ...port, presentation: { kind, version: 1 as const } };
    }),
  },
  title: definition.title,
});
