import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allocatedStockingCost: number;
  readonly totalStockingCost: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedStockingCost: { type: "number", minimum: 0 },
    totalStockingCost: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["allocatedStockingCost", "totalStockingCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate a supplied land-lease allocation share of positive total stocking cost and the unallocated remainder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allocatedStockingCost, totalStockingCost } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalStockingCost) && totalStockingCost > 0,
      "totalStockingCost",
    ),
      totalStockingCost);
    H.domain(
      allocatedStockingCost >= 0 && allocatedStockingCost <= totalStockingCost,
      "allocatedStockingCost",
    );
    return {
      fraction: allocatedStockingCost / totalStockingCost,
      remainder: totalStockingCost - allocatedStockingCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allocatedStockingCost: 30, totalStockingCost: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const landLeaseStockingCostShareTool = H.defineSchemaCalculation<
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
    id: "agricultural-economics/land-lease-stocking-cost-share",
    title: "Land Lease Stocking Cost Share",
    description:
      "Calculate a supplied land-lease allocation share of positive total stocking cost and the unallocated remainder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedStockingCost: { type: "number", minimum: 0 },
        totalStockingCost: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["allocatedStockingCost", "totalStockingCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "allocatedStockingCost",
          label: "Allocated Stocking Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalStockingCost",
          label: "Total Stocking Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = landLeaseStockingCostShareTool.execute;
export default landLeaseStockingCostShareTool;
