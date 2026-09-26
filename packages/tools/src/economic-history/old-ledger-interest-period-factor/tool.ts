import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly principal: number;
  readonly ratePerYear: number;
  readonly days: number;
  readonly daysPerYear: number;
  readonly compound: boolean;
};
export type Output = { readonly interest: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    principal: { type: "number" },
    ratePerYear: { type: "number", exclusiveMinimum: -1 },
    days: { type: "number", minimum: 0 },
    daysPerYear: { type: "number", exclusiveMinimum: 0 },
    compound: { type: "boolean" },
  },
  required: ["principal", "ratePerYear", "days", "daysPerYear", "compound"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { interest: { type: "number" } },
  required: ["interest"],
} as const;
/** Simple or effective annual compound accrual with an explicit ledger day-count denominator; no historical convention is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { principal, ratePerYear, days, daysPerYear, compound } = request;
  const compute = (): Output => {
    H.domain(ratePerYear > -1 && days >= 0);
    H.positive(daysPerYear);
    return {
      interest:
        principal *
        (compound
          ? Math.expm1((Math.log1p(ratePerYear) * days) / daysPerYear)
          : (ratePerYear * days) / daysPerYear),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    principal: 100,
    ratePerYear: 0.1,
    days: 180,
    daysPerYear: 360,
    compound: false,
  },
  output: { interest: 5 },
} satisfies ToolExample<Input, Output>;
export const oldLedgerInterestPeriodFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/old-ledger-interest-period-factor",
    title: "Old Ledger Interest Period Factor Tool",
    description:
      "Simple or effective annual compound accrual with an explicit ledger day-count denominator; no historical convention is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        principal: { type: "number" },
        ratePerYear: { type: "number", exclusiveMinimum: -1 },
        days: { type: "number", minimum: 0 },
        daysPerYear: { type: "number", exclusiveMinimum: 0 },
        compound: { type: "boolean" },
      },
      required: ["principal", "ratePerYear", "days", "daysPerYear", "compound"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { interest: { type: "number" } },
      required: ["interest"],
    },
    ports: {
      inputs: [
        {
          id: "principal",
          label: "Principal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ratePerYear",
          label: "Rate Per Year",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "daysPerYear",
          label: "Days Per Year",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "compound",
          label: "Compound",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "interest", label: "Interest", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = oldLedgerInterestPeriodFactorTool.execute;
export default oldLedgerInterestPeriodFactorTool;
