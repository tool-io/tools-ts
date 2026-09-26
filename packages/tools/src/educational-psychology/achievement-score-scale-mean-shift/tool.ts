import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawScore: number;
  readonly sourceMean: number;
  readonly sourceSd: number;
  readonly targetMean: number;
  readonly targetSd: number;
};
export type Output = { readonly z: number; readonly scaledScore: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawScore: { type: "number" },
    sourceMean: { type: "number" },
    sourceSd: { type: "number", exclusiveMinimum: 0 },
    targetMean: { type: "number" },
    targetSd: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rawScore", "sourceMean", "sourceSd", "targetMean", "targetSd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { z: { type: "number" }, scaledScore: { type: "number" } },
  required: ["z", "scaledScore"],
} as const;
/** Linear standard-score scale conversion using caller-supplied reference distributions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawScore, sourceMean, sourceSd, targetMean, targetSd } = request;
  const compute = (): Output => {
    H.positive(sourceSd);
    H.positive(targetSd);
    return {
      z: (rawScore - sourceMean) / sourceSd,
      scaledScore: targetMean + ((rawScore - sourceMean) * targetSd) / sourceSd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rawScore: 70,
    sourceMean: 50,
    sourceSd: 10,
    targetMean: 100,
    targetSd: 15,
  },
  output: { z: 2, scaledScore: 130 },
} satisfies ToolExample<Input, Output>;
export const achievementScoreScaleMeanShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/achievement-score-scale-mean-shift",
    title: "Achievement Score Scale Mean Shift Tool",
    description:
      "Linear standard-score scale conversion using caller-supplied reference distributions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawScore: { type: "number" },
        sourceMean: { type: "number" },
        sourceSd: { type: "number", exclusiveMinimum: 0 },
        targetMean: { type: "number" },
        targetSd: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "rawScore",
        "sourceMean",
        "sourceSd",
        "targetMean",
        "targetSd",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { z: { type: "number" }, scaledScore: { type: "number" } },
      required: ["z", "scaledScore"],
    },
    ports: {
      inputs: [
        {
          id: "rawScore",
          label: "Raw Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceMean",
          label: "Source Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sourceSd",
          label: "Source Sd",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetMean",
          label: "Target Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetSd",
          label: "Target Sd",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "z", label: "Z", valueType: { type: "number" } },
        {
          id: "scaledScore",
          label: "Scaled Score",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = achievementScoreScaleMeanShiftTool.execute;
export default achievementScoreScaleMeanShiftTool;
