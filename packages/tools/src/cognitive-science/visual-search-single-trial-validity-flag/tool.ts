import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseCorrect: boolean;
  readonly timingAvailable: boolean;
  readonly trialComplete: boolean;
};
export type Output = { readonly validUnderFlags: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseCorrect: { type: "boolean" },
    timingAvailable: { type: "boolean" },
    trialComplete: { type: "boolean" },
  },
  required: ["responseCorrect", "timingAvailable", "trialComplete"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { validUnderFlags: { type: "boolean" } },
  required: ["validUnderFlags"],
} as const;
/** Combine explicit accuracy, timing and completion flags for one visual-search trial without inferring a participant trait. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseCorrect, timingAvailable, trialComplete } = request;
  const compute = (): Output => {
    return {
      validUnderFlags: responseCorrect && timingAvailable && trialComplete,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseCorrect: true, timingAvailable: true, trialComplete: true },
  output: { validUnderFlags: true },
} satisfies ToolExample<Input, Output>;
export const visualSearchSingleTrialValidityFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["cognitive-science", "cognitive science", "psychology"],
        keywords: ["cognitive science", "psychology"],
      },
      id: "cognitive-science/visual-search-single-trial-validity-flag",
      title: "Visual Search Single Trial Validity Flag",
      description:
        "Combine explicit accuracy, timing and completion flags for one visual-search trial without inferring a participant trait.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responseCorrect: { type: "boolean" },
          timingAvailable: { type: "boolean" },
          trialComplete: { type: "boolean" },
        },
        required: ["responseCorrect", "timingAvailable", "trialComplete"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { validUnderFlags: { type: "boolean" } },
        required: ["validUnderFlags"],
      },
      ports: {
        inputs: [
          {
            id: "responseCorrect",
            label: "Response Correct",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "timingAvailable",
            label: "Timing Available",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "trialComplete",
            label: "Trial Complete",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "validUnderFlags",
            label: "Valid Under Flags",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = visualSearchSingleTrialValidityFlagTool.execute;
export default visualSearchSingleTrialValidityFlagTool;
