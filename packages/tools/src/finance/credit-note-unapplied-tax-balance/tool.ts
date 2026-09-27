import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalTax: number;
  readonly creditedTax: number;
  readonly appliedCredit: number;
};
export type Output = {
  readonly remainingTaxCredit: number;
  readonly netTax: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalTax: { type: "number", minimum: 0 },
    creditedTax: { type: "number", minimum: 0 },
    appliedCredit: { type: "number", minimum: 0 },
  },
  required: ["originalTax", "creditedTax", "appliedCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingTaxCredit: { type: "number" },
    netTax: { type: "number" },
  },
  required: ["remainingTaxCredit", "netTax"],
} as const;
/** Reconcile explicit tax-credit amounts without tax-rate or eligibility rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalTax, creditedTax, appliedCredit } = request;
  const compute = (): Output => {
    H.domain(
      originalTax >= 0 &&
        creditedTax >= 0 &&
        appliedCredit >= 0 &&
        appliedCredit <= creditedTax &&
        appliedCredit <= originalTax,
    );
    return {
      remainingTaxCredit: creditedTax - appliedCredit,
      netTax: originalTax - appliedCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalTax: 100, creditedTax: 30, appliedCredit: 20 },
  output: { remainingTaxCredit: 10, netTax: 80 },
} satisfies ToolExample<Input, Output>;
export const creditNoteUnappliedTaxBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/credit-note-unapplied-tax-balance",
    title: "Credit Note Unapplied Tax Balance Tool",
    description:
      "Reconcile explicit tax-credit amounts without tax-rate or eligibility rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalTax: { type: "number", minimum: 0 },
        creditedTax: { type: "number", minimum: 0 },
        appliedCredit: { type: "number", minimum: 0 },
      },
      required: ["originalTax", "creditedTax", "appliedCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingTaxCredit: { type: "number" },
        netTax: { type: "number" },
      },
      required: ["remainingTaxCredit", "netTax"],
    },
    ports: {
      inputs: [
        {
          id: "originalTax",
          label: "Original Tax",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedTax",
          label: "Credited Tax",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "appliedCredit",
          label: "Applied Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingTaxCredit",
          label: "Remaining Tax Credit",
          valueType: { type: "number" },
        },
        { id: "netTax", label: "Net Tax", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = creditNoteUnappliedTaxBalanceTool.execute;
export default creditNoteUnappliedTaxBalanceTool;
