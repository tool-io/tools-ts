import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personalRelevance: number;
  readonly workRelevance: number;
  readonly scaleMinimum: number;
  readonly scaleMaximum: number;
};
export type Output = {
  readonly personalMinusWork: number;
  readonly equalRatings: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personalRelevance: { type: "number" },
    workRelevance: { type: "number" },
    scaleMinimum: { type: "number" },
    scaleMaximum: { type: "number" },
  },
  required: [
    "personalRelevance",
    "workRelevance",
    "scaleMinimum",
    "scaleMaximum",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personalMinusWork: { type: "number" },
    equalRatings: { type: "boolean" },
  },
  required: ["personalMinusWork", "equalRatings"],
} as const;
/** Compare two explicitly supplied relevance ratings on a common scale without combining or interpreting them. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personalRelevance, workRelevance, scaleMinimum, scaleMaximum } =
    request;
  const compute = (): Output => {
    H.domain(
      scaleMinimum < scaleMaximum &&
        personalRelevance >= scaleMinimum &&
        personalRelevance <= scaleMaximum &&
        workRelevance >= scaleMinimum &&
        workRelevance <= scaleMaximum,
      "scaleMinimum",
    );
    return {
      personalMinusWork: personalRelevance - workRelevance,
      equalRatings: personalRelevance === workRelevance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    personalRelevance: 4,
    workRelevance: 2,
    scaleMinimum: 1,
    scaleMaximum: 5,
  },
  output: { personalMinusWork: 2, equalRatings: false },
} satisfies ToolExample<Input, Output>;
export const problemCaseRelevanceRatingPairTool = H.defineSchemaCalculation<
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
    id: "andragogy/problem-case-relevance-rating-pair",
    title: "Problem Case Relevance Rating Pair",
    description:
      "Compare two explicitly supplied relevance ratings on a common scale without combining or interpreting them.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personalRelevance: { type: "number" },
        workRelevance: { type: "number" },
        scaleMinimum: { type: "number" },
        scaleMaximum: { type: "number" },
      },
      required: [
        "personalRelevance",
        "workRelevance",
        "scaleMinimum",
        "scaleMaximum",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personalMinusWork: { type: "number" },
        equalRatings: { type: "boolean" },
      },
      required: ["personalMinusWork", "equalRatings"],
    },
    ports: {
      inputs: [
        {
          id: "personalRelevance",
          label: "Personal Relevance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "workRelevance",
          label: "Work Relevance",
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
          id: "personalMinusWork",
          label: "Personal Minus Work",
          valueType: { type: "number" },
        },
        {
          id: "equalRatings",
          label: "Equal Ratings",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = problemCaseRelevanceRatingPairTool.execute;
export default problemCaseRelevanceRatingPairTool;
