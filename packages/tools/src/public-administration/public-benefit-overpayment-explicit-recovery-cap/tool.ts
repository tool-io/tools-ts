import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly overpayment: number;
  readonly installment: number;
  readonly suppliedCap: number;
};
export type Output = { readonly recovered: number; readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overpayment: { type: "number", minimum: 0 },
    installment: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
  },
  required: ["overpayment", "installment", "suppliedCap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recovered: { type: "number" }, remaining: { type: "number" } },
  required: ["recovered", "remaining"],
} as const;
/** Cap one supplied installment without inferring recovery eligibility or hardship policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { overpayment, installment, suppliedCap } = request;
  const compute = (): Output => {
    H.domain(overpayment >= 0 && installment >= 0 && suppliedCap >= 0);
    return {
      recovered: Math.min(overpayment, installment, suppliedCap),
      remaining: overpayment - Math.min(overpayment, installment, suppliedCap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { overpayment: 500, installment: 100, suppliedCap: 80 },
  output: { recovered: 80, remaining: 420 },
} satisfies ToolExample<Input, Output>;
export const publicBenefitOverpaymentExplicitRecoveryCapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-administration/public-benefit-overpayment-explicit-recovery-cap",
      title: "Public Benefit Overpayment Explicit Recovery Cap Tool",
      description:
        "Cap one supplied installment without inferring recovery eligibility or hardship policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          overpayment: { type: "number", minimum: 0 },
          installment: { type: "number", minimum: 0 },
          suppliedCap: { type: "number", minimum: 0 },
        },
        required: ["overpayment", "installment", "suppliedCap"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recovered: { type: "number" },
          remaining: { type: "number" },
        },
        required: ["recovered", "remaining"],
      },
      ports: {
        inputs: [
          {
            id: "overpayment",
            label: "Overpayment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "installment",
            label: "Installment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedCap",
            label: "Supplied Cap",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "recovered",
            label: "Recovered",
            valueType: { type: "number" },
          },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = publicBenefitOverpaymentExplicitRecoveryCapTool.execute;
export default publicBenefitOverpaymentExplicitRecoveryCapTool;
