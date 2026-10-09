import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly notional: number;
  readonly signedRateBasis: number;
  readonly accrualYearFraction: number;
};
export type Output = { readonly signedCashflow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    notional: { type: "number", minimum: 0 },
    signedRateBasis: { type: "number" },
    accrualYearFraction: { type: "number", minimum: 0 },
  },
  required: ["notional", "signedRateBasis", "accrualYearFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCashflow: { type: "number" } },
  required: ["signedCashflow"],
} as const;
/** Multiply supplied notional, signed fractional funding basis and explicit accrual year fraction for one simple cashflow. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { notional, signedRateBasis, accrualYearFraction } = request;
  const compute = (): Output => {
    H.domain(notional >= 0, "notional");
    H.domain(accrualYearFraction >= 0, "accrualYearFraction");
    return { signedCashflow: notional * signedRateBasis * accrualYearFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    notional: 1000000,
    signedRateBasis: 0.002,
    accrualYearFraction: 0.25,
  },
  output: { signedCashflow: 500 },
} satisfies ToolExample<Input, Output>;
export const fundingBasisSinglePeriodCashflowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/funding-basis-single-period-cashflow",
    title: "Funding Basis Single Period Cashflow Tool",
    description:
      "Multiply supplied notional, signed fractional funding basis and explicit accrual year fraction for one simple cashflow.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        notional: { type: "number", minimum: 0 },
        signedRateBasis: { type: "number" },
        accrualYearFraction: { type: "number", minimum: 0 },
      },
      required: ["notional", "signedRateBasis", "accrualYearFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCashflow: { type: "number" } },
      required: ["signedCashflow"],
    },
    ports: {
      inputs: [
        {
          id: "notional",
          label: "Notional",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedRateBasis",
          label: "Signed Rate Basis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "accrualYearFraction",
          label: "Accrual Year Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedCashflow",
          label: "Signed Cashflow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fundingBasisSinglePeriodCashflowTool.execute;
export default fundingBasisSinglePeriodCashflowTool;
