import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalAssistCost: number;
  readonly allocatedUnits: number;
  readonly totalRepresentedUnits: number;
};
export type Output = { readonly allocatedAssistCost: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalAssistCost: { type: "number", minimum: 0 },
    allocatedUnits: { type: "integer", minimum: 0 },
    totalRepresentedUnits: { type: "integer", minimum: 1 },
  },
  required: ["totalAssistCost", "allocatedUnits", "totalRepresentedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allocatedAssistCost: { type: "number" } },
  required: ["allocatedAssistCost"],
} as const;
/** Allocate an explicitly supplied customs assist cost proportionally to represented units without determining legally includable assists. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalAssistCost, allocatedUnits, totalRepresentedUnits } = request;
  const compute = (): Output => {
    H.domain(totalAssistCost >= 0, "totalAssistCost");
    (H.domain(
      Number.isSafeInteger(totalRepresentedUnits) &&
        totalRepresentedUnits >= 1 &&
        totalRepresentedUnits <= Number.MAX_SAFE_INTEGER,
      "totalRepresentedUnits",
    ),
      totalRepresentedUnits);
    (H.domain(
      Number.isSafeInteger(allocatedUnits) &&
        allocatedUnits >= 0 &&
        allocatedUnits <= totalRepresentedUnits,
      "allocatedUnits",
    ),
      allocatedUnits);
    return {
      allocatedAssistCost:
        totalAssistCost * (allocatedUnits / totalRepresentedUnits),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    totalAssistCost: 1000,
    allocatedUnits: 25,
    totalRepresentedUnits: 100,
  },
  output: { allocatedAssistCost: 250 },
} satisfies ToolExample<Input, Output>;
export const customsValuationAssistCostTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/customs-valuation-assist-cost-term",
    title: "Customs Valuation Assist Cost Term Tool",
    description:
      "Allocate an explicitly supplied customs assist cost proportionally to represented units without determining legally includable assists.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalAssistCost: { type: "number", minimum: 0 },
        allocatedUnits: { type: "integer", minimum: 0 },
        totalRepresentedUnits: { type: "integer", minimum: 1 },
      },
      required: ["totalAssistCost", "allocatedUnits", "totalRepresentedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allocatedAssistCost: { type: "number" } },
      required: ["allocatedAssistCost"],
    },
    ports: {
      inputs: [
        {
          id: "totalAssistCost",
          label: "Total Assist Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedUnits",
          label: "Allocated Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "totalRepresentedUnits",
          label: "Total Represented Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "allocatedAssistCost",
          label: "Allocated Assist Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = customsValuationAssistCostTermTool.execute;
export default customsValuationAssistCostTermTool;
