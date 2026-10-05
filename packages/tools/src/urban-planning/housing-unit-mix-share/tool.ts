import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly unitCounts: readonly number[] };
export type Output = {
  readonly shares: readonly number[];
  readonly totalUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["unitCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shares: { type: "array", maxItems: 256, items: { type: "number" } },
    totalUnits: { type: "integer" },
  },
  required: ["shares", "totalUnits"],
} as const;
/** Calculate mutually exclusive housing-unit category shares from nonnegative counts and a positive total. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unitCounts } = request;
  const compute = (): Output => {
    unitCounts.forEach((v) => H.integer(v));
    const totalUnits = unitCounts.reduce((a, b) => a + b, 0);
    H.integer(totalUnits, 1);
    return { shares: unitCounts.map((v) => v / totalUnits), totalUnits };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unitCounts: [20, 30, 50] },
  output: { shares: [0.2, 0.3, 0.5], totalUnits: 100 },
} satisfies ToolExample<Input, Output>;
export const housingUnitMixShareTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "urban-planning/housing-unit-mix-share",
      title: "Housing Unit Mix Share Tool",
      description:
        "Calculate mutually exclusive housing-unit category shares from nonnegative counts and a positive total.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unitCounts: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["unitCounts"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          shares: { type: "array", maxItems: 256, items: { type: "number" } },
          totalUnits: { type: "integer" },
        },
        required: ["shares", "totalUnits"],
      },
      ports: {
        inputs: [
          {
            id: "unitCounts",
            label: "Unit Counts",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "shares",
            label: "Shares",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "totalUnits",
            label: "Total Units",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = housingUnitMixShareTool.execute;
export default housingUnitMixShareTool;
