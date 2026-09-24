import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly currentWorkingCapital: number;
  readonly priorWorkingCapital: number;
};
export type Output = {
  readonly increase: number;
  readonly cashflowContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentWorkingCapital: { type: "number" },
    priorWorkingCapital: { type: "number" },
  },
  required: ["currentWorkingCapital", "priorWorkingCapital"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    increase: { type: "number" },
    cashflowContribution: { type: "number" },
  },
  required: ["increase", "cashflowContribution"],
} as const;
/** Return the negative change in explicitly defined operating working capital; no complete free-cash-flow calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { currentWorkingCapital, priorWorkingCapital } = request;
  const compute = (): Output => {
    return {
      increase: currentWorkingCapital - priorWorkingCapital,
      cashflowContribution: priorWorkingCapital - currentWorkingCapital,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { currentWorkingCapital: 120, priorWorkingCapital: 100 },
  output: { increase: 20, cashflowContribution: -20 },
} satisfies ToolExample<Input, Output>;
export const freeCashflowWorkingCapitalTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "corporate-finance/free-cashflow-working-capital-term",
    title: "Free Cashflow Working Capital Term Tool",
    description:
      "Return the negative change in explicitly defined operating working capital; no complete free-cash-flow calculation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentWorkingCapital: { type: "number" },
        priorWorkingCapital: { type: "number" },
      },
      required: ["currentWorkingCapital", "priorWorkingCapital"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        increase: { type: "number" },
        cashflowContribution: { type: "number" },
      },
      required: ["increase", "cashflowContribution"],
    },
    ports: {
      inputs: [
        {
          id: "currentWorkingCapital",
          label: "Current Working Capital",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorWorkingCapital",
          label: "Prior Working Capital",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "increase", label: "Increase", valueType: { type: "number" } },
        {
          id: "cashflowContribution",
          label: "Cashflow Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = freeCashflowWorkingCapitalTermTool.execute;
export default freeCashflowWorkingCapitalTermTool;
