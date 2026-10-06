import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly principal: number;
  readonly suppliedAnnualRate: number;
  readonly delayDays: number;
  readonly suppliedDaysPerYear: number;
};
export type Output = { readonly simpleDelayInterest: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    principal: { type: "number", minimum: 0 },
    suppliedAnnualRate: { type: "number" },
    delayDays: { type: "number", minimum: 0 },
    suppliedDaysPerYear: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "principal",
    "suppliedAnnualRate",
    "delayDays",
    "suppliedDaysPerYear",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { simpleDelayInterest: { type: "number" } },
  required: ["simpleDelayInterest"],
} as const;
/** Calculate simple delay interest from explicit amount, signed annual rate, elapsed days, and supplied day-count denominator without applying law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { principal, suppliedAnnualRate, delayDays, suppliedDaysPerYear } =
    request;
  const compute = (): Output => {
    H.domain(principal >= 0 && delayDays >= 0, "principal");
    (H.domain(suppliedDaysPerYear > 0, "suppliedDaysPerYear"),
      suppliedDaysPerYear);
    return {
      simpleDelayInterest:
        principal * suppliedAnnualRate * (delayDays / suppliedDaysPerYear),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    principal: 1000,
    suppliedAnnualRate: 0.05,
    delayDays: 30,
    suppliedDaysPerYear: 365,
  },
  output: { simpleDelayInterest: 4.10958904109589 },
} satisfies ToolExample<Input, Output>;
export const subsidyPaymentDelayInterestTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agricultural-policy", "agricultural policy", "agriculture"],
      keywords: ["agricultural policy", "agriculture"],
    },
    id: "agricultural-policy/subsidy-payment-delay-interest",
    title: "Subsidy Payment Delay Interest",
    description:
      "Calculate simple delay interest from explicit amount, signed annual rate, elapsed days, and supplied day-count denominator without applying law.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        principal: { type: "number", minimum: 0 },
        suppliedAnnualRate: { type: "number" },
        delayDays: { type: "number", minimum: 0 },
        suppliedDaysPerYear: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "principal",
        "suppliedAnnualRate",
        "delayDays",
        "suppliedDaysPerYear",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { simpleDelayInterest: { type: "number" } },
      required: ["simpleDelayInterest"],
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
          id: "suppliedAnnualRate",
          label: "Supplied Annual Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delayDays",
          label: "Delay Days",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDaysPerYear",
          label: "Supplied Days Per Year",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "simpleDelayInterest",
          label: "Simple Delay Interest",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = subsidyPaymentDelayInterestTool.execute;
export default subsidyPaymentDelayInterestTool;
