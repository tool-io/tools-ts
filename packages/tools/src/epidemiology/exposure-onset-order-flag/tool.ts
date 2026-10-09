import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposureTime: number;
  readonly onsetTime: number;
};
export type Output = {
  readonly exposurePrecedesOnset: boolean;
  readonly simultaneous: boolean;
  readonly signedLag: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposureTime: { type: "number" },
    onsetTime: { type: "number" },
  },
  required: ["exposureTime", "onsetTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposurePrecedesOnset: { type: "boolean" },
    simultaneous: { type: "boolean" },
    signedLag: { type: "number" },
  },
  required: ["exposurePrecedesOnset", "simultaneous", "signedLag"],
} as const;
/** Compare explicitly supplied exposure and onset times on one timeline without inferring causation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposureTime, onsetTime } = request;
  const compute = (): Output => {
    return {
      exposurePrecedesOnset: exposureTime < onsetTime,
      simultaneous: exposureTime === onsetTime,
      signedLag: onsetTime - exposureTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exposureTime: 10, onsetTime: 15 },
  output: { exposurePrecedesOnset: true, simultaneous: false, signedLag: 5 },
} satisfies ToolExample<Input, Output>;
export const exposureOnsetOrderFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["epidemiology", "health and medicine"],
      keywords: ["epidemiology", "health and medicine"],
    },
    id: "epidemiology/exposure-onset-order-flag",
    title: "Exposure Onset Order Flag",
    description:
      "Compare explicitly supplied exposure and onset times on one timeline without inferring causation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposureTime: { type: "number" },
        onsetTime: { type: "number" },
      },
      required: ["exposureTime", "onsetTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposurePrecedesOnset: { type: "boolean" },
        simultaneous: { type: "boolean" },
        signedLag: { type: "number" },
      },
      required: ["exposurePrecedesOnset", "simultaneous", "signedLag"],
    },
    ports: {
      inputs: [
        {
          id: "exposureTime",
          label: "Exposure Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "onsetTime",
          label: "Onset Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "exposurePrecedesOnset",
          label: "Exposure Precedes Onset",
          valueType: { type: "boolean" },
        },
        {
          id: "simultaneous",
          label: "Simultaneous",
          valueType: { type: "boolean" },
        },
        { id: "signedLag", label: "Signed Lag", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = exposureOnsetOrderFlagTool.execute;
export default exposureOnsetOrderFlagTool;
