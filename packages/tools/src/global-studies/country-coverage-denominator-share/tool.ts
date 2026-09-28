import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredCount: number;
  readonly knownEligibleCount: number;
  readonly unknownEligibleCount: number;
  readonly includeUnknown: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly coverage: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredCount: { type: "integer", minimum: 0 },
    knownEligibleCount: { type: "integer", minimum: 0 },
    unknownEligibleCount: { type: "integer", minimum: 0 },
    includeUnknown: { type: "boolean" },
  },
  required: [
    "coveredCount",
    "knownEligibleCount",
    "unknownEligibleCount",
    "includeUnknown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    coverage: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "coverage", "defined"],
} as const;
/** Audit supplied country-series coverage counts without imposing a country list or eligibility rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    coveredCount,
    knownEligibleCount,
    unknownEligibleCount,
    includeUnknown,
  } = request;
  const compute = (): Output => {
    H.integer(knownEligibleCount, 0);
    H.integer(coveredCount, 0, knownEligibleCount);
    H.integer(unknownEligibleCount, 0);
    return {
      denominator:
        knownEligibleCount + (includeUnknown ? unknownEligibleCount : 0),
      coverage:
        knownEligibleCount + (includeUnknown ? unknownEligibleCount : 0) > 0
          ? coveredCount /
            (knownEligibleCount + (includeUnknown ? unknownEligibleCount : 0))
          : 0,
      defined:
        knownEligibleCount + (includeUnknown ? unknownEligibleCount : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coveredCount: 60,
    knownEligibleCount: 80,
    unknownEligibleCount: 20,
    includeUnknown: true,
  },
  output: { denominator: 100, coverage: 0.6, defined: true },
} satisfies ToolExample<Input, Output>;
export const countryCoverageDenominatorShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/country-coverage-denominator-share",
    title: "Country Coverage Denominator Share Tool",
    description:
      "Audit supplied country-series coverage counts without imposing a country list or eligibility rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredCount: { type: "integer", minimum: 0 },
        knownEligibleCount: { type: "integer", minimum: 0 },
        unknownEligibleCount: { type: "integer", minimum: 0 },
        includeUnknown: { type: "boolean" },
      },
      required: [
        "coveredCount",
        "knownEligibleCount",
        "unknownEligibleCount",
        "includeUnknown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        coverage: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "coverage", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "coveredCount",
          label: "Covered Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "knownEligibleCount",
          label: "Known Eligible Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unknownEligibleCount",
          label: "Unknown Eligible Count",
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
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = countryCoverageDenominatorShareTool.execute;
export default countryCoverageDenominatorShareTool;
