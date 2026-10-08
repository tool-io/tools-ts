import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredMaximum: number;
  readonly optionalMaximum: number;
  readonly earnedRequired: number;
  readonly earnedOptional: number;
  readonly includeOptional: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly countedEarned: number;
  readonly scoreFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredMaximum: { type: "number", minimum: 0 },
    optionalMaximum: { type: "number", minimum: 0 },
    earnedRequired: { type: "number", minimum: 0 },
    earnedOptional: { type: "number", minimum: 0 },
    includeOptional: { type: "boolean" },
  },
  required: [
    "requiredMaximum",
    "optionalMaximum",
    "earnedRequired",
    "earnedOptional",
    "includeOptional",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "number" },
    countedEarned: { type: "number" },
    scoreFraction: { type: "number" },
  },
  required: ["denominator", "countedEarned", "scoreFraction"],
} as const;
/** Score explicit rubric point totals under a caller-selected optional-criterion inclusion policy without choosing a grading standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    requiredMaximum,
    optionalMaximum,
    earnedRequired,
    earnedOptional,
    includeOptional,
  } = request;
  const compute = (): Output => {
    H.domain(requiredMaximum >= 0 && optionalMaximum >= 0, "requiredMaximum");
    H.domain(
      earnedRequired >= 0 && earnedRequired <= requiredMaximum,
      "earnedRequired",
    );
    H.domain(
      earnedOptional >= 0 && earnedOptional <= optionalMaximum,
      "earnedOptional",
    );
    return (() => {
      const denominator =
          requiredMaximum + (includeOptional ? optionalMaximum : 0),
        countedEarned = earnedRequired + (includeOptional ? earnedOptional : 0);
      H.domain(
        Number.isFinite(denominator) && denominator > 0,
        "requiredMaximum",
      );
      return {
        denominator,
        countedEarned,
        scoreFraction: countedEarned / denominator,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredMaximum: 80,
    optionalMaximum: 20,
    earnedRequired: 60,
    earnedOptional: 10,
    includeOptional: true,
  },
  output: { denominator: 100, countedEarned: 70, scoreFraction: 0.7 },
} satisfies ToolExample<Input, Output>;
export const rubricOptionalCriterionDenominatorChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["education"],
        keywords: ["education"],
      },
      id: "education/rubric-optional-criterion-denominator-choice",
      title: "Rubric Optional Criterion Denominator Choice",
      description:
        "Score explicit rubric point totals under a caller-selected optional-criterion inclusion policy without choosing a grading standard.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          requiredMaximum: { type: "number", minimum: 0 },
          optionalMaximum: { type: "number", minimum: 0 },
          earnedRequired: { type: "number", minimum: 0 },
          earnedOptional: { type: "number", minimum: 0 },
          includeOptional: { type: "boolean" },
        },
        required: [
          "requiredMaximum",
          "optionalMaximum",
          "earnedRequired",
          "earnedOptional",
          "includeOptional",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          denominator: { type: "number" },
          countedEarned: { type: "number" },
          scoreFraction: { type: "number" },
        },
        required: ["denominator", "countedEarned", "scoreFraction"],
      },
      ports: {
        inputs: [
          {
            id: "requiredMaximum",
            label: "Required Maximum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "optionalMaximum",
            label: "Optional Maximum",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "earnedRequired",
            label: "Earned Required",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "earnedOptional",
            label: "Earned Optional",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeOptional",
            label: "Include Optional",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "denominator",
            label: "Denominator",
            valueType: { type: "number" },
          },
          {
            id: "countedEarned",
            label: "Counted Earned",
            valueType: { type: "number" },
          },
          {
            id: "scoreFraction",
            label: "Score Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rubricOptionalCriterionDenominatorChoiceTool.execute;
export default rubricOptionalCriterionDenominatorChoiceTool;
