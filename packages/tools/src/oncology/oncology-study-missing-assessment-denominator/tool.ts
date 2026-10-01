import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduled: number;
  readonly assessed: number;
  readonly unevaluable: number;
  readonly positive: number;
  readonly excludeUnevaluable: boolean;
};
export type Output = {
  readonly analysisDenominator: number;
  readonly positiveFraction: number;
  readonly assessedFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduled: { type: "integer", minimum: 1 },
    assessed: { type: "integer", minimum: 1 },
    unevaluable: { type: "integer", minimum: 0 },
    positive: { type: "integer", minimum: 0 },
    excludeUnevaluable: { type: "boolean" },
  },
  required: [
    "scheduled",
    "assessed",
    "unevaluable",
    "positive",
    "excludeUnevaluable",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    analysisDenominator: { type: "integer" },
    positiveFraction: { type: "number" },
    assessedFraction: { type: "number" },
  },
  required: ["analysisDenominator", "positiveFraction", "assessedFraction"],
} as const;
/** Explicit research assessment denominator policy; no clinical positive outcome or statistical missingness mechanism is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduled, assessed, unevaluable, positive, excludeUnevaluable } =
    request;
  const compute = (): Output => {
    H.integer(scheduled, 1);
    H.integer(assessed, 1, scheduled);
    H.integer(unevaluable, 0, assessed - 1);
    H.integer(positive, 0, assessed - unevaluable);
    return {
      analysisDenominator: excludeUnevaluable
        ? assessed - unevaluable
        : scheduled,
      positiveFraction:
        positive / (excludeUnevaluable ? assessed - unevaluable : scheduled),
      assessedFraction: assessed / scheduled,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduled: 100,
    assessed: 80,
    unevaluable: 10,
    positive: 35,
    excludeUnevaluable: true,
  },
  output: {
    analysisDenominator: 70,
    positiveFraction: 0.5,
    assessedFraction: 0.8,
  },
} satisfies ToolExample<Input, Output>;
export const oncologyStudyMissingAssessmentDenominatorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "oncology/oncology-study-missing-assessment-denominator",
      title: "Oncology Study Missing Assessment Denominator Tool",
      description:
        "Explicit research assessment denominator policy; no clinical positive outcome or statistical missingness mechanism is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scheduled: { type: "integer", minimum: 1 },
          assessed: { type: "integer", minimum: 1 },
          unevaluable: { type: "integer", minimum: 0 },
          positive: { type: "integer", minimum: 0 },
          excludeUnevaluable: { type: "boolean" },
        },
        required: [
          "scheduled",
          "assessed",
          "unevaluable",
          "positive",
          "excludeUnevaluable",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          analysisDenominator: { type: "integer" },
          positiveFraction: { type: "number" },
          assessedFraction: { type: "number" },
        },
        required: [
          "analysisDenominator",
          "positiveFraction",
          "assessedFraction",
        ],
      },
      ports: {
        inputs: [
          {
            id: "scheduled",
            label: "Scheduled",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "assessed",
            label: "Assessed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "unevaluable",
            label: "Unevaluable",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "positive",
            label: "Positive",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "excludeUnevaluable",
            label: "Exclude Unevaluable",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "analysisDenominator",
            label: "Analysis Denominator",
            valueType: { type: "integer" },
          },
          {
            id: "positiveFraction",
            label: "Positive Fraction",
            valueType: { type: "number" },
          },
          {
            id: "assessedFraction",
            label: "Assessed Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = oncologyStudyMissingAssessmentDenominatorTool.execute;
export default oncologyStudyMissingAssessmentDenominatorTool;
