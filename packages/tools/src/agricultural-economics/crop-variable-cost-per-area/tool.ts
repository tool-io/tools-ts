import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly seedCost: number;
  readonly fertilizerCost: number;
  readonly otherVariableCost: number;
  readonly hectares: number;
};
export type Output = {
  readonly variableCostPerHectare: number;
  readonly totalVariableCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seedCost: { type: "number", minimum: 0 },
    fertilizerCost: { type: "number", minimum: 0 },
    otherVariableCost: { type: "number", minimum: 0 },
    hectares: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["seedCost", "fertilizerCost", "otherVariableCost", "hectares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variableCostPerHectare: { type: "number" },
    totalVariableCost: { type: "number" },
  },
  required: ["variableCostPerHectare", "totalVariableCost"],
} as const;
/** Normalize explicitly nonoverlapping crop variable costs by a positive cropped area in hectares. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seedCost, fertilizerCost, otherVariableCost, hectares } = request;
  const compute = (): Output => {
    H.domain(
      seedCost >= 0 && fertilizerCost >= 0 && otherVariableCost >= 0,
      "seedCost",
    );
    (H.domain(hectares > 0, "hectares"), hectares);
    return {
      variableCostPerHectare:
        (seedCost + fertilizerCost + otherVariableCost) / hectares,
      totalVariableCost: seedCost + fertilizerCost + otherVariableCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    seedCost: 200,
    fertilizerCost: 300,
    otherVariableCost: 100,
    hectares: 4,
  },
  output: { variableCostPerHectare: 150, totalVariableCost: 600 },
} satisfies ToolExample<Input, Output>;
export const cropVariableCostPerAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["cost", "learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/crop-variable-cost-per-area",
    title: "Crop Variable Cost Per Area",
    description:
      "Normalize explicitly nonoverlapping crop variable costs by a positive cropped area in hectares.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seedCost: { type: "number", minimum: 0 },
        fertilizerCost: { type: "number", minimum: 0 },
        otherVariableCost: { type: "number", minimum: 0 },
        hectares: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["seedCost", "fertilizerCost", "otherVariableCost", "hectares"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variableCostPerHectare: { type: "number" },
        totalVariableCost: { type: "number" },
      },
      required: ["variableCostPerHectare", "totalVariableCost"],
    },
    ports: {
      inputs: [
        {
          id: "seedCost",
          label: "Seed Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fertilizerCost",
          label: "Fertilizer Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherVariableCost",
          label: "Other Variable Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hectares",
          label: "Hectares",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "variableCostPerHectare",
          label: "Variable Cost Per Hectare",
          valueType: { type: "number" },
        },
        {
          id: "totalVariableCost",
          label: "Total Variable Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cropVariableCostPerAreaTool.execute;
export default cropVariableCostPerAreaTool;
