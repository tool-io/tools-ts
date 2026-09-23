import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly allocatedDays: number;
  readonly totalDays: number;
};
export type Output = { readonly allocated: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number" },
    allocatedDays: { type: "number", minimum: 0 },
    totalDays: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["amount", "allocatedDays", "totalDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { allocated: { type: "number" } },
  required: ["allocated"],
} as const;
/** Prorate a supplied amount on an explicit day-count basis without interpreting contract terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, allocatedDays, totalDays } = request;
  const compute = (): Output => {
    H.positive(totalDays);
    H.domain(allocatedDays >= 0 && allocatedDays <= totalDays);
    return { allocated: (amount * allocatedDays) / totalDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amount: 1200, allocatedDays: 10, totalDays: 30 },
  output: { allocated: 400 },
} satisfies ToolExample<Input, Output>;
export const contractDayAllocationTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "business-administration/contract-day-allocation-term",
    title: "Contract Day Allocation Term Tool",
    description:
      "Prorate a supplied amount on an explicit day-count basis without interpreting contract terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number" },
        allocatedDays: { type: "number", minimum: 0 },
        totalDays: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["amount", "allocatedDays", "totalDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { allocated: { type: "number" } },
      required: ["allocated"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedDays",
          label: "Allocated Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalDays",
          label: "Total Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "allocated", label: "Allocated", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = contractDayAllocationTermTool.execute;
export default contractDayAllocationTermTool;
