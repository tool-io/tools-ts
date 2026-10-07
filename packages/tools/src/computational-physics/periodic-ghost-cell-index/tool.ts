import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly storageIndex: number;
  readonly interiorCellCount: number;
  readonly ghostLayers: number;
};
export type Output = {
  readonly interiorSourceIndex: number;
  readonly ghostCell: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    storageIndex: { type: "integer", minimum: 0 },
    interiorCellCount: { type: "integer", minimum: 1 },
    ghostLayers: { type: "integer", minimum: 0, maximum: 4503599627370495 },
  },
  required: ["storageIndex", "interiorCellCount", "ghostLayers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interiorSourceIndex: { type: "integer" },
    ghostCell: { type: "boolean" },
  },
  required: ["interiorSourceIndex", "ghostCell"],
} as const;
/** Map one allocated periodic ghost-cell storage position to its zero-based interior source cell, with explicit ghost layers on both ends. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { storageIndex, interiorCellCount, ghostLayers } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(interiorCellCount) &&
        interiorCellCount >= 1 &&
        interiorCellCount <= Number.MAX_SAFE_INTEGER,
      "interiorCellCount",
    ),
      interiorCellCount);
    (H.domain(
      Number.isSafeInteger(ghostLayers) &&
        ghostLayers >= 0 &&
        ghostLayers <=
          Math.floor((Number.MAX_SAFE_INTEGER - interiorCellCount) / 2),
      "ghostLayers",
    ),
      ghostLayers);
    (H.domain(
      Number.isSafeInteger(storageIndex) &&
        storageIndex >= 0 &&
        storageIndex <= interiorCellCount + 2 * ghostLayers - 1,
      "storageIndex",
    ),
      storageIndex);
    const raw = storageIndex - ghostLayers,
      r = raw % interiorCellCount;
    return {
      interiorSourceIndex: r < 0 ? r + interiorCellCount : r,
      ghostCell: raw < 0 || raw >= interiorCellCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { storageIndex: 0, interiorCellCount: 4, ghostLayers: 1 },
  output: { interiorSourceIndex: 3, ghostCell: true },
} satisfies ToolExample<Input, Output>;
export const periodicGhostCellIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/periodic-ghost-cell-index",
    title: "Periodic Ghost Cell Index",
    description:
      "Map one allocated periodic ghost-cell storage position to its zero-based interior source cell, with explicit ghost layers on both ends.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        storageIndex: { type: "integer", minimum: 0 },
        interiorCellCount: { type: "integer", minimum: 1 },
        ghostLayers: { type: "integer", minimum: 0, maximum: 4503599627370495 },
      },
      required: ["storageIndex", "interiorCellCount", "ghostLayers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interiorSourceIndex: { type: "integer" },
        ghostCell: { type: "boolean" },
      },
      required: ["interiorSourceIndex", "ghostCell"],
    },
    ports: {
      inputs: [
        {
          id: "storageIndex",
          label: "Storage Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "interiorCellCount",
          label: "Interior Cell Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "ghostLayers",
          label: "Ghost Layers",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "interiorSourceIndex",
          label: "Interior Source Index",
          valueType: { type: "integer" },
        },
        {
          id: "ghostCell",
          label: "Ghost Cell",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = periodicGhostCellIndexTool.execute;
export default periodicGhostCellIndexTool;
