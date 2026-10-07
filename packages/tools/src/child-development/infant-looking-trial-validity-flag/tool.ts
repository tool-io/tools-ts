import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stimulusPresented: boolean;
  readonly trackingAvailable: boolean;
  readonly trialCompleted: boolean;
};
export type Output = { readonly validUnderFlags: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stimulusPresented: { type: "boolean" },
    trackingAvailable: { type: "boolean" },
    trialCompleted: { type: "boolean" },
  },
  required: ["stimulusPresented", "trackingAvailable", "trialCompleted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { validUnderFlags: { type: "boolean" } },
  required: ["validUnderFlags"],
} as const;
/** Combine three explicitly supplied looking-trial completeness flags without evaluating an infant’s attention or developmental status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stimulusPresented, trackingAvailable, trialCompleted } = request;
  const compute = (): Output => {
    return {
      validUnderFlags: stimulusPresented && trackingAvailable && trialCompleted,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stimulusPresented: true,
    trackingAvailable: true,
    trialCompleted: true,
  },
  output: { validUnderFlags: true },
} satisfies ToolExample<Input, Output>;
export const infantLookingTrialValidityFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/infant-looking-trial-validity-flag",
    title: "Infant Looking Trial Validity Flag",
    description:
      "Combine three explicitly supplied looking-trial completeness flags without evaluating an infant’s attention or developmental status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stimulusPresented: { type: "boolean" },
        trackingAvailable: { type: "boolean" },
        trialCompleted: { type: "boolean" },
      },
      required: ["stimulusPresented", "trackingAvailable", "trialCompleted"],
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
          id: "stimulusPresented",
          label: "Stimulus Presented",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "trackingAvailable",
          label: "Tracking Available",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "trialCompleted",
          label: "Trial Completed",
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
export const run = infantLookingTrialValidityFlagTool.execute;
export default infantLookingTrialValidityFlagTool;
