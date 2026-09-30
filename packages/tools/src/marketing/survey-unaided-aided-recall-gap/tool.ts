import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly respondents: number;
  readonly unaided: number;
  readonly aided: number;
};
export type Output = {
  readonly unaidedFraction: number;
  readonly aidedFraction: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    respondents: { type: "integer", minimum: 1 },
    unaided: { type: "integer", minimum: 0 },
    aided: { type: "integer", minimum: 0 },
  },
  required: ["respondents", "unaided", "aided"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaidedFraction: { type: "number" },
    aidedFraction: { type: "number" },
    gap: { type: "number" },
  },
  required: ["unaidedFraction", "aidedFraction", "gap"],
} as const;
/** Compare recall on a common supplied denominator; aided counts need not contain unaided counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { respondents, unaided, aided } = request;
  const compute = (): Output => {
    H.integer(respondents, 1);
    H.integer(unaided, 0, respondents);
    H.integer(aided, 0, respondents);
    return {
      unaidedFraction: unaided / respondents,
      aidedFraction: aided / respondents,
      gap: (aided - unaided) / respondents,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { respondents: 100, unaided: 20, aided: 50 },
  output: { unaidedFraction: 0.2, aidedFraction: 0.5, gap: 0.3 },
} satisfies ToolExample<Input, Output>;
export const surveyUnaidedAidedRecallGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/survey-unaided-aided-recall-gap",
    title: "Survey Unaided Aided Recall Gap Tool",
    description:
      "Compare recall on a common supplied denominator; aided counts need not contain unaided counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        respondents: { type: "integer", minimum: 1 },
        unaided: { type: "integer", minimum: 0 },
        aided: { type: "integer", minimum: 0 },
      },
      required: ["respondents", "unaided", "aided"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unaidedFraction: { type: "number" },
        aidedFraction: { type: "number" },
        gap: { type: "number" },
      },
      required: ["unaidedFraction", "aidedFraction", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "respondents",
          label: "Respondents",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unaided",
          label: "Unaided",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "aided",
          label: "Aided",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unaidedFraction",
          label: "Unaided Fraction",
          valueType: { type: "number" },
        },
        {
          id: "aidedFraction",
          label: "Aided Fraction",
          valueType: { type: "number" },
        },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = surveyUnaidedAidedRecallGapTool.execute;
export default surveyUnaidedAidedRecallGapTool;
