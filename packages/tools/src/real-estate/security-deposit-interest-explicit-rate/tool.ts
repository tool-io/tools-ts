import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deposit: number;
  readonly annualRate: number;
  readonly elapsedDays: number;
  readonly basisDays: number;
  readonly withholding: number;
};
export type Output = { readonly interest: number; readonly refund: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deposit: { type: "number", minimum: 0 },
    annualRate: { type: "number", minimum: 0 },
    elapsedDays: { type: "number", minimum: 0 },
    basisDays: { type: "number", exclusiveMinimum: 0 },
    withholding: { type: "number", minimum: 0 },
  },
  required: [
    "deposit",
    "annualRate",
    "elapsedDays",
    "basisDays",
    "withholding",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { interest: { type: "number" }, refund: { type: "number" } },
  required: ["interest", "refund"],
} as const;
/** Simple interest with all rates, withholding and day-count conventions supplied explicitly. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deposit, annualRate, elapsedDays, basisDays, withholding } = request;
  const compute = (): Output => {
    H.domain(
      deposit >= 0 && annualRate >= 0 && elapsedDays >= 0 && withholding >= 0,
    );
    H.positive(basisDays);
    return {
      interest: (deposit * annualRate * elapsedDays) / basisDays,
      refund:
        deposit * (1 + (annualRate * elapsedDays) / basisDays) - withholding,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deposit: 1000,
    annualRate: 0.02,
    elapsedDays: 180,
    basisDays: 360,
    withholding: 100,
  },
  output: { interest: 10, refund: 910 },
} satisfies ToolExample<Input, Output>;
export const securityDepositInterestExplicitRateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "real-estate/security-deposit-interest-explicit-rate",
      title: "Security Deposit Interest Explicit Rate Tool",
      description:
        "Simple interest with all rates, withholding and day-count conventions supplied explicitly.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deposit: { type: "number", minimum: 0 },
          annualRate: { type: "number", minimum: 0 },
          elapsedDays: { type: "number", minimum: 0 },
          basisDays: { type: "number", exclusiveMinimum: 0 },
          withholding: { type: "number", minimum: 0 },
        },
        required: [
          "deposit",
          "annualRate",
          "elapsedDays",
          "basisDays",
          "withholding",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          interest: { type: "number" },
          refund: { type: "number" },
        },
        required: ["interest", "refund"],
      },
      ports: {
        inputs: [
          {
            id: "deposit",
            label: "Deposit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "annualRate",
            label: "Annual Rate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsedDays",
            label: "Elapsed Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "basisDays",
            label: "Basis Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "withholding",
            label: "Withholding",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "interest", label: "Interest", valueType: { type: "number" } },
          { id: "refund", label: "Refund", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = securityDepositInterestExplicitRateTool.execute;
export default securityDepositInterestExplicitRateTool;
