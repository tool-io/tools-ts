import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cashflow: number;
  readonly dailyRate: number;
  readonly dayOffset: number;
};
export type Output = { readonly value: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cashflow: { type: "number" },
    dailyRate: { type: "number", exclusiveMinimum: -1 },
    dayOffset: { type: "integer" },
  },
  required: ["cashflow", "dailyRate", "dayOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { value: { type: "number" } },
  required: ["value"],
} as const;
/** Move a signed cashflow by an explicit integer value-date offset under daily compound interest. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { cashflow, dailyRate, dayOffset } = input;
  const compute = (): Output => {
    H.domain(dailyRate > -1);
    return { value: cashflow * (1 + dailyRate) ** dayOffset };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cashflow: 100, dailyRate: 0.1, dayOffset: 2 },
  output: { value: 121.00000000000001 },
} satisfies ToolExample<Input, Output>;
export const loanCashflowValueDateOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/loan-cashflow-value-date-offset",
    title: "Loan Cashflow Value Date Offset Tool",
    description:
      "Move a signed cashflow by an explicit integer value-date offset under daily compound interest.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cashflow: { type: "number" },
        dailyRate: { type: "number", exclusiveMinimum: -1 },
        dayOffset: { type: "integer" },
      },
      required: ["cashflow", "dailyRate", "dayOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { value: { type: "number" } },
      required: ["value"],
    },
    ports: {
      inputs: [
        {
          id: "cashflow",
          label: "Cashflow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyRate",
          label: "Daily Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dayOffset",
          label: "Day Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "value", label: "Value", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = loanCashflowValueDateOffsetTool.execute;
export default loanCashflowValueDateOffsetTool;
