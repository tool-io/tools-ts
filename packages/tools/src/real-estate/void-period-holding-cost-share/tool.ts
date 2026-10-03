import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voidDays: number;
  readonly periodDays: number;
  readonly totalHoldingCost: number;
};
export type Output = { readonly share: number; readonly allocatedCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidDays: { type: "number", minimum: 0 },
    periodDays: { type: "number", exclusiveMinimum: 0 },
    totalHoldingCost: { type: "number", minimum: 0 },
  },
  required: ["voidDays", "periodDays", "totalHoldingCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, allocatedCost: { type: "number" } },
  required: ["share", "allocatedCost"],
} as const;
/** Calculate void period holding cost share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voidDays, periodDays, totalHoldingCost } = request;
  const compute = (): Output => {
    H.positive(periodDays);
    H.domain(voidDays >= 0 && voidDays <= periodDays && totalHoldingCost >= 0);
    return {
      share: voidDays / periodDays,
      allocatedCost: totalHoldingCost * (voidDays / periodDays),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voidDays: 15, periodDays: 60, totalHoldingCost: 800 },
  output: { share: 0.25, allocatedCost: 200 },
} satisfies ToolExample<Input, Output>;
export const voidPeriodHoldingCostShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "real-estate/void-period-holding-cost-share",
    title: "Void Period Holding Cost Share Tool",
    description:
      "Calculate void period holding cost share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidDays: { type: "number", minimum: 0 },
        periodDays: { type: "number", exclusiveMinimum: 0 },
        totalHoldingCost: { type: "number", minimum: 0 },
      },
      required: ["voidDays", "periodDays", "totalHoldingCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        share: { type: "number" },
        allocatedCost: { type: "number" },
      },
      required: ["share", "allocatedCost"],
    },
    ports: {
      inputs: [
        {
          id: "voidDays",
          label: "Void Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periodDays",
          label: "Period Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalHoldingCost",
          label: "Total Holding Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "allocatedCost",
          label: "Allocated Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = voidPeriodHoldingCostShareTool.execute;
export default voidPeriodHoldingCostShareTool;
