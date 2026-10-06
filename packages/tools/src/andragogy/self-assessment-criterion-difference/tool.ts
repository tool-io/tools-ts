import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly selfRating: number;
  readonly comparisonRating: number;
  readonly scaleMinimum: number;
  readonly scaleMaximum: number;
};
export type Output = { readonly difference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selfRating: { type: "number" },
    comparisonRating: { type: "number" },
    scaleMinimum: { type: "number" },
    scaleMaximum: { type: "number" },
  },
  required: ["selfRating", "comparisonRating", "scaleMinimum", "scaleMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { difference: { type: "number" } },
  required: ["difference"],
} as const;
/** Compare two supplied criterion ratings on the same explicit bounded scale without judging either rater’s accuracy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { selfRating, comparisonRating, scaleMinimum, scaleMaximum } = request;
  const compute = (): Output => {
    H.domain(
      scaleMinimum < scaleMaximum &&
        selfRating >= scaleMinimum &&
        selfRating <= scaleMaximum &&
        comparisonRating >= scaleMinimum &&
        comparisonRating <= scaleMaximum,
      "scaleMinimum",
    );
    return { difference: selfRating - comparisonRating };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    selfRating: 4,
    comparisonRating: 3,
    scaleMinimum: 1,
    scaleMaximum: 5,
  },
  output: { difference: 1 },
} satisfies ToolExample<Input, Output>;
export const selfAssessmentCriterionDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/self-assessment-criterion-difference",
    title: "Self Assessment Criterion Difference",
    description:
      "Compare two supplied criterion ratings on the same explicit bounded scale without judging either rater’s accuracy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selfRating: { type: "number" },
        comparisonRating: { type: "number" },
        scaleMinimum: { type: "number" },
        scaleMaximum: { type: "number" },
      },
      required: [
        "selfRating",
        "comparisonRating",
        "scaleMinimum",
        "scaleMaximum",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { difference: { type: "number" } },
      required: ["difference"],
    },
    ports: {
      inputs: [
        {
          id: "selfRating",
          label: "Self Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "comparisonRating",
          label: "Comparison Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMinimum",
          label: "Scale Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMaximum",
          label: "Scale Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = selfAssessmentCriterionDifferenceTool.execute;
export default selfAssessmentCriterionDifferenceTool;
