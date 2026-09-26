import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bond: number;
  readonly annualRate: number;
  readonly years: number;
  readonly forfeitedFraction: number;
};
export type Output = {
  readonly accruedBond: number;
  readonly refund: number;
  readonly forfeiture: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bond: { type: "number", minimum: 0 },
    annualRate: { type: "number", exclusiveMinimum: -1 },
    years: { type: "number", minimum: 0 },
    forfeitedFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["bond", "annualRate", "years", "forfeitedFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accruedBond: { type: "number" },
    refund: { type: "number" },
    forfeiture: { type: "number" },
  },
  required: ["accruedBond", "refund", "forfeiture"],
} as const;
/** Caller-defined refund rule applying forfeiture to principal plus accrued interest. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bond, annualRate, years, forfeitedFraction } = request;
  const compute = (): Output => {
    H.domain(bond >= 0 && annualRate > -1 && years >= 0);
    H.probability(forfeitedFraction);
    return {
      accruedBond: bond * (1 + annualRate) ** years,
      refund: bond * (1 + annualRate) ** years * (1 - forfeitedFraction),
      forfeiture: bond * (1 + annualRate) ** years * forfeitedFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bond: 10000, annualRate: 0.1, years: 2, forfeitedFraction: 0.2 },
  output: {
    accruedBond: 12100.000000000002,
    refund: 9680.000000000002,
    forfeiture: 2420.0000000000005,
  },
} satisfies ToolExample<Input, Output>;
export const restorationBondRefundInterestTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/restoration-bond-refund-interest-term",
    title: "Restoration Bond Refund Interest Term Tool",
    description:
      "Caller-defined refund rule applying forfeiture to principal plus accrued interest.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bond: { type: "number", minimum: 0 },
        annualRate: { type: "number", exclusiveMinimum: -1 },
        years: { type: "number", minimum: 0 },
        forfeitedFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["bond", "annualRate", "years", "forfeitedFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accruedBond: { type: "number" },
        refund: { type: "number" },
        forfeiture: { type: "number" },
      },
      required: ["accruedBond", "refund", "forfeiture"],
    },
    ports: {
      inputs: [
        {
          id: "bond",
          label: "Bond",
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
          id: "years",
          label: "Years",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forfeitedFraction",
          label: "Forfeited Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "accruedBond",
          label: "Accrued Bond",
          valueType: { type: "number" },
        },
        { id: "refund", label: "Refund", valueType: { type: "number" } },
        {
          id: "forfeiture",
          label: "Forfeiture",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = restorationBondRefundInterestTermTool.execute;
export default restorationBondRefundInterestTermTool;
