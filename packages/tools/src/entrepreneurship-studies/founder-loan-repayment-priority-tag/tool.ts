import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loanId: string;
  readonly suppliedPriority: string;
  readonly agreementSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loanId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPriority: { type: "string", maxLength: 8192, minLength: 1 },
    agreementSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["loanId", "suppliedPriority", "agreementSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied founder-loan priority assertion and source without determining enforceability or repayment order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loanId, suppliedPriority, agreementSource } = request;
  const compute = (): Output => {
    H.domain(loanId.length > 0, "loanId");
    H.domain(suppliedPriority.length > 0, "suppliedPriority");
    H.domain(agreementSource.length > 0, "agreementSource");
    return {
      token: JSON.stringify([loanId, suppliedPriority, agreementSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    loanId: "L17",
    suppliedPriority: "subordinated",
    agreementSource: "agreement A4",
  },
  output: { token: '["L17","subordinated","agreement A4"]' },
} satisfies ToolExample<Input, Output>;
export const founderLoanRepaymentPriorityTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/founder-loan-repayment-priority-tag",
    title: "Founder Loan Repayment Priority Tag Tool",
    description:
      "Record a supplied founder-loan priority assertion and source without determining enforceability or repayment order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loanId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPriority: { type: "string", maxLength: 8192, minLength: 1 },
        agreementSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["loanId", "suppliedPriority", "agreementSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "loanId",
          label: "Loan Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPriority",
          label: "Supplied Priority",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "agreementSource",
          label: "Agreement Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = founderLoanRepaymentPriorityTagTool.execute;
export default founderLoanRepaymentPriorityTagTool;
