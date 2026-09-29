import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleDays: number;
  readonly dailyCap: number;
  readonly actualExpense: number;
  readonly employerAdvance: number;
};
export type Output = {
  readonly expenseCap: number;
  readonly reimbursable: number;
  readonly settlement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleDays: { type: "number", minimum: 0 },
    dailyCap: { type: "number", minimum: 0 },
    actualExpense: { type: "number", minimum: 0 },
    employerAdvance: { type: "number", minimum: 0 },
  },
  required: ["eligibleDays", "dailyCap", "actualExpense", "employerAdvance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expenseCap: { type: "number" },
    reimbursable: { type: "number" },
    settlement: { type: "number" },
  },
  required: ["expenseCap", "reimbursable", "settlement"],
} as const;
/** Calculate business travel local perdiem cap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleDays, dailyCap, actualExpense, employerAdvance } = request;
  const compute = (): Output => {
    H.domain(
      eligibleDays >= 0 &&
        dailyCap >= 0 &&
        actualExpense >= 0 &&
        employerAdvance >= 0,
    );
    return {
      expenseCap: eligibleDays * dailyCap,
      reimbursable: Math.min(actualExpense, eligibleDays * dailyCap),
      settlement:
        Math.min(actualExpense, eligibleDays * dailyCap) - employerAdvance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleDays: 3,
    dailyCap: 100,
    actualExpense: 350,
    employerAdvance: 200,
  },
  output: { expenseCap: 300, reimbursable: 300, settlement: 100 },
} satisfies ToolExample<Input, Output>;
export const businessTravelLocalPerdiemCapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/business-travel-local-perdiem-cap",
    title: "Business Travel Local Perdiem Cap Tool",
    description:
      "Calculate business travel local perdiem cap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleDays: { type: "number", minimum: 0 },
        dailyCap: { type: "number", minimum: 0 },
        actualExpense: { type: "number", minimum: 0 },
        employerAdvance: { type: "number", minimum: 0 },
      },
      required: [
        "eligibleDays",
        "dailyCap",
        "actualExpense",
        "employerAdvance",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expenseCap: { type: "number" },
        reimbursable: { type: "number" },
        settlement: { type: "number" },
      },
      required: ["expenseCap", "reimbursable", "settlement"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleDays",
          label: "Eligible Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyCap",
          label: "Daily Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualExpense",
          label: "Actual Expense",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "employerAdvance",
          label: "Employer Advance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expenseCap",
          label: "Expense Cap",
          valueType: { type: "number" },
        },
        {
          id: "reimbursable",
          label: "Reimbursable",
          valueType: { type: "number" },
        },
        {
          id: "settlement",
          label: "Settlement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = businessTravelLocalPerdiemCapTool.execute;
export default businessTravelLocalPerdiemCapTool;
