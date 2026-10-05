import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly wrist: string; readonly dominantHand: string };
export type Output = {
  readonly label: string;
  readonly dominantWrist: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wrist: { type: "string", maxLength: 8192, enum: ["left", "right"] },
    dominantHand: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "ambidextrous", "unknown"],
    },
  },
  required: ["wrist", "dominantHand"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    dominantWrist: { type: "boolean" },
  },
  required: ["label", "dominantWrist"],
} as const;
/** Label a wearable's recorded wrist side and an explicitly reported dominant hand. Ambidextrous or unknown dominance never asserts a dominant wrist. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wrist, dominantHand } = request;
  const compute = (): Output => {
    H.domain(["left", "right"].includes(wrist), "wrist");
    H.domain(
      ["left", "right", "ambidextrous", "unknown"].includes(dominantHand),
      "dominantHand",
    );
    return {
      label: wrist + " wrist; dominant hand " + dominantHand,
      dominantWrist: wrist === dominantHand,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wrist: "left", dominantHand: "right" },
  output: { label: "left wrist; dominant hand right", dominantWrist: false },
} satisfies ToolExample<Input, Output>;
export const wearableWristSideRecordLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health/wearable-wrist-side-record-label",
    title: "Wearable Wrist Side Record Label Tool",
    description:
      "Label a wearable's recorded wrist side and an explicitly reported dominant hand. Ambidextrous or unknown dominance never asserts a dominant wrist.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wrist: { type: "string", maxLength: 8192, enum: ["left", "right"] },
        dominantHand: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "ambidextrous", "unknown"],
        },
      },
      required: ["wrist", "dominantHand"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        dominantWrist: { type: "boolean" },
      },
      required: ["label", "dominantWrist"],
    },
    ports: {
      inputs: [
        {
          id: "wrist",
          label: "Wrist",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dominantHand",
          label: "Dominant Hand",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "dominantWrist",
          label: "Dominant Wrist",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = wearableWristSideRecordLabelTool.execute;
export default wearableWristSideRecordLabelTool;
