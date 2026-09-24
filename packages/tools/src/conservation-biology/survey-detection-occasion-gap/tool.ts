import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOccasion: number;
  readonly secondOccasion: number;
};
export type Output = {
  readonly interveningOccasions: number;
  readonly signedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOccasion: { type: "integer", minimum: 0 },
    secondOccasion: { type: "integer", minimum: 0 },
  },
  required: ["firstOccasion", "secondOccasion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interveningOccasions: { type: "integer" },
    signedGap: { type: "integer" },
  },
  required: ["interveningOccasions", "signedGap"],
} as const;
/** Calculate survey detection occasion gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOccasion, secondOccasion } = request;
  const compute = (): Output => {
    H.integer(firstOccasion, 0);
    H.integer(secondOccasion, 0);
    return {
      interveningOccasions: Math.max(
        0,
        Math.abs(secondOccasion - firstOccasion) - 1,
      ),
      signedGap: secondOccasion - firstOccasion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOccasion: 2, secondOccasion: 5 },
  output: { interveningOccasions: 2, signedGap: 3 },
} satisfies ToolExample<Input, Output>;
export const surveyDetectionOccasionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/survey-detection-occasion-gap",
    title: "Survey Detection Occasion Gap Tool",
    description:
      "Calculate survey detection occasion gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOccasion: { type: "integer", minimum: 0 },
        secondOccasion: { type: "integer", minimum: 0 },
      },
      required: ["firstOccasion", "secondOccasion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interveningOccasions: { type: "integer" },
        signedGap: { type: "integer" },
      },
      required: ["interveningOccasions", "signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "firstOccasion",
          label: "First Occasion",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondOccasion",
          label: "Second Occasion",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "interveningOccasions",
          label: "Intervening Occasions",
          valueType: { type: "integer" },
        },
        {
          id: "signedGap",
          label: "Signed Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = surveyDetectionOccasionGapTool.execute;
export default surveyDetectionOccasionGapTool;
