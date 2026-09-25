import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredMonths: number;
  readonly unknownMonths: number;
  readonly eligibleMonths: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly coverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredMonths: { type: "integer", minimum: 0 },
    unknownMonths: { type: "integer", minimum: 0 },
    eligibleMonths: { type: "integer", minimum: 1 },
    includeUnknown: { type: "boolean" },
  },
  required: [
    "coveredMonths",
    "unknownMonths",
    "eligibleMonths",
    "includeUnknown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    coverage: { type: "number" },
  },
  required: ["denominator", "coverage"],
} as const;
/** Supplied coverage-month denominator, without determining pension eligibility or benefit rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coveredMonths, unknownMonths, eligibleMonths, includeUnknown } =
    request;
  const compute = (): Output => {
    H.integer(eligibleMonths, 1);
    H.integer(unknownMonths, 0, eligibleMonths - 1);
    H.integer(coveredMonths, 0, eligibleMonths - unknownMonths);
    return {
      denominator: eligibleMonths - (includeUnknown ? 0 : unknownMonths),
      coverage:
        coveredMonths / (eligibleMonths - (includeUnknown ? 0 : unknownMonths)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coveredMonths: 8,
    unknownMonths: 2,
    eligibleMonths: 12,
    includeUnknown: false,
  },
  output: { denominator: 10, coverage: 0.8 },
} satisfies ToolExample<Input, Output>;
export const pensionMonthCoverageDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/pension-month-coverage-denominator",
    title: "Pension Month Coverage Denominator Tool",
    description:
      "Supplied coverage-month denominator, without determining pension eligibility or benefit rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredMonths: { type: "integer", minimum: 0 },
        unknownMonths: { type: "integer", minimum: 0 },
        eligibleMonths: { type: "integer", minimum: 1 },
        includeUnknown: { type: "boolean" },
      },
      required: [
        "coveredMonths",
        "unknownMonths",
        "eligibleMonths",
        "includeUnknown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        coverage: { type: "number" },
      },
      required: ["denominator", "coverage"],
    },
    ports: {
      inputs: [
        {
          id: "coveredMonths",
          label: "Covered Months",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknownMonths",
          label: "Unknown Months",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eligibleMonths",
          label: "Eligible Months",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeUnknown",
          label: "Include Unknown",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        { id: "coverage", label: "Coverage", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = pensionMonthCoverageDenominatorTool.execute;
export default pensionMonthCoverageDenominatorTool;
