import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allowed: number;
  readonly copay: number;
  readonly remainingCap: number;
  readonly covered: boolean;
};
export type Output = {
  readonly patientPaid: number;
  readonly insurerPaid: number;
  readonly capRemaining: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowed: { type: "number", minimum: 0 },
    copay: { type: "number", minimum: 0 },
    remainingCap: { type: "number", minimum: 0 },
    covered: { type: "boolean" },
  },
  required: ["allowed", "copay", "remainingCap", "covered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    patientPaid: { type: "number" },
    insurerPaid: { type: "number" },
    capRemaining: { type: "number" },
  },
  required: ["patientPaid", "insurerPaid", "capRemaining"],
} as const;
/** Apply an explicit covered-claim copayment cap under the supplied simple policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allowed, copay, remainingCap, covered } = request;
  const compute = (): Output => {
    H.domain(allowed >= 0 && copay >= 0 && remainingCap >= 0);
    return {
      patientPaid: covered ? Math.min(allowed, copay, remainingCap) : allowed,
      insurerPaid: covered
        ? allowed - Math.min(allowed, copay, remainingCap)
        : 0,
      capRemaining: covered
        ? remainingCap - Math.min(allowed, copay, remainingCap)
        : remainingCap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allowed: 100, copay: 25, remainingCap: 15, covered: true },
  output: { patientPaid: 15, insurerPaid: 85, capRemaining: 0 },
} satisfies ToolExample<Input, Output>;
export const insuranceCopaymentCapOneClaimTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/insurance-copayment-cap-one-claim-term",
    title: "Insurance Copayment Cap One Claim Term Tool",
    description:
      "Apply an explicit covered-claim copayment cap under the supplied simple policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allowed: { type: "number", minimum: 0 },
        copay: { type: "number", minimum: 0 },
        remainingCap: { type: "number", minimum: 0 },
        covered: { type: "boolean" },
      },
      required: ["allowed", "copay", "remainingCap", "covered"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        patientPaid: { type: "number" },
        insurerPaid: { type: "number" },
        capRemaining: { type: "number" },
      },
      required: ["patientPaid", "insurerPaid", "capRemaining"],
    },
    ports: {
      inputs: [
        {
          id: "allowed",
          label: "Allowed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "copay",
          label: "Copay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingCap",
          label: "Remaining Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "covered",
          label: "Covered",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "patientPaid",
          label: "Patient Paid",
          valueType: { type: "number" },
        },
        {
          id: "insurerPaid",
          label: "Insurer Paid",
          valueType: { type: "number" },
        },
        {
          id: "capRemaining",
          label: "Cap Remaining",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insuranceCopaymentCapOneClaimTermTool.execute;
export default insuranceCopaymentCapOneClaimTermTool;
