import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly advance: number;
  readonly eligibleExpenditure: number;
  readonly priorReimbursement: number;
};
export type Output = {
  readonly unspentAdvance: number;
  readonly unreimbursedEligible: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    advance: { type: "number", minimum: 0 },
    eligibleExpenditure: { type: "number", minimum: 0 },
    priorReimbursement: { type: "number", minimum: 0 },
  },
  required: ["advance", "eligibleExpenditure", "priorReimbursement"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unspentAdvance: { type: "number" },
    unreimbursedEligible: { type: "number" },
  },
  required: ["unspentAdvance", "unreimbursedEligible"],
} as const;
/** Calculate grant advance expenditure reconcile from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { advance, eligibleExpenditure, priorReimbursement } = request;
  const compute = (): Output => {
    H.domain(
      advance >= 0 && eligibleExpenditure >= 0 && priorReimbursement >= 0,
    );
    return {
      unspentAdvance: Math.max(
        0,
        advance + priorReimbursement - eligibleExpenditure,
      ),
      unreimbursedEligible: Math.max(
        0,
        eligibleExpenditure - advance - priorReimbursement,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { advance: 1000, eligibleExpenditure: 800, priorReimbursement: 0 },
  output: { unspentAdvance: 200, unreimbursedEligible: 0 },
} satisfies ToolExample<Input, Output>;
export const grantAdvanceExpenditureReconcileTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/grant-advance-expenditure-reconcile",
    title: "Grant Advance Expenditure Reconcile Tool",
    description:
      "Calculate grant advance expenditure reconcile from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        advance: { type: "number", minimum: 0 },
        eligibleExpenditure: { type: "number", minimum: 0 },
        priorReimbursement: { type: "number", minimum: 0 },
      },
      required: ["advance", "eligibleExpenditure", "priorReimbursement"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unspentAdvance: { type: "number" },
        unreimbursedEligible: { type: "number" },
      },
      required: ["unspentAdvance", "unreimbursedEligible"],
    },
    ports: {
      inputs: [
        {
          id: "advance",
          label: "Advance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleExpenditure",
          label: "Eligible Expenditure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorReimbursement",
          label: "Prior Reimbursement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unspentAdvance",
          label: "Unspent Advance",
          valueType: { type: "number" },
        },
        {
          id: "unreimbursedEligible",
          label: "Unreimbursed Eligible",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = grantAdvanceExpenditureReconcileTool.execute;
export default grantAdvanceExpenditureReconcileTool;
