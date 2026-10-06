import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly plannedPositions: number;
  readonly occupiedPositions: number;
};
export type Output = {
  readonly missingPositions: number;
  readonly surplusOccupancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plannedPositions: { type: "integer", minimum: 0 },
    occupiedPositions: { type: "integer", minimum: 0 },
  },
  required: ["plannedPositions", "occupiedPositions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingPositions: { type: "integer" },
    surplusOccupancy: { type: "integer" },
  },
  required: ["missingPositions", "surplusOccupancy"],
} as const;
/** Compare explicit planned and occupied tree-row counts without detecting or attributing missing trees. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { plannedPositions, occupiedPositions } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(plannedPositions) &&
        plannedPositions >= 0 &&
        plannedPositions <= Number.MAX_SAFE_INTEGER,
      "plannedPositions",
    ),
      plannedPositions);
    (H.domain(
      Number.isSafeInteger(occupiedPositions) &&
        occupiedPositions >= 0 &&
        occupiedPositions <= Number.MAX_SAFE_INTEGER,
      "occupiedPositions",
    ),
      occupiedPositions);
    return {
      missingPositions: Math.max(0, plannedPositions - occupiedPositions),
      surplusOccupancy: Math.max(0, occupiedPositions - plannedPositions),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { plannedPositions: 40, occupiedPositions: 35 },
  output: { missingPositions: 5, surplusOccupancy: 0 },
} satisfies ToolExample<Input, Output>;
export const treeRowMissingTreeCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroforestry", "agriculture"],
      keywords: ["agroforestry", "agriculture"],
    },
    id: "agroforestry/tree-row-missing-tree-count",
    title: "Tree Row Missing Tree Count",
    description:
      "Compare explicit planned and occupied tree-row counts without detecting or attributing missing trees.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plannedPositions: { type: "integer", minimum: 0 },
        occupiedPositions: { type: "integer", minimum: 0 },
      },
      required: ["plannedPositions", "occupiedPositions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingPositions: { type: "integer" },
        surplusOccupancy: { type: "integer" },
      },
      required: ["missingPositions", "surplusOccupancy"],
    },
    ports: {
      inputs: [
        {
          id: "plannedPositions",
          label: "Planned Positions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "occupiedPositions",
          label: "Occupied Positions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "missingPositions",
          label: "Missing Positions",
          valueType: { type: "integer" },
        },
        {
          id: "surplusOccupancy",
          label: "Surplus Occupancy",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeRowMissingTreeCountTool.execute;
export default treeRowMissingTreeCountTool;
