import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yaw: number;
  readonly pitch: number;
  readonly roll: number;
  readonly reverseYaw: boolean;
  readonly reversePitch: boolean;
  readonly reverseRoll: boolean;
};
export type Output = {
  readonly yaw: number;
  readonly pitch: number;
  readonly roll: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yaw: { type: "number" },
    pitch: { type: "number" },
    roll: { type: "number" },
    reverseYaw: { type: "boolean" },
    reversePitch: { type: "boolean" },
    reverseRoll: { type: "boolean" },
  },
  required: [
    "yaw",
    "pitch",
    "roll",
    "reverseYaw",
    "reversePitch",
    "reverseRoll",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yaw: { type: "number" },
    pitch: { type: "number" },
    roll: { type: "number" },
  },
  required: ["yaw", "pitch", "roll"],
} as const;
/** Reorient supplied bench trace components under independent explicit axis-sign flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yaw, pitch, roll, reverseYaw, reversePitch, reverseRoll } = request;
  const compute = (): Output => {
    return {
      yaw: yaw * (reverseYaw ? -1 : 1),
      pitch: pitch * (reversePitch ? -1 : 1),
      roll: roll * (reverseRoll ? -1 : 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    yaw: 1,
    pitch: 2,
    roll: 3,
    reverseYaw: true,
    reversePitch: false,
    reverseRoll: true,
  },
  output: { yaw: -1, pitch: 2, roll: -3 },
} satisfies ToolExample<Input, Output>;
export const vestibularReferenceAxisSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "otolaryngology/vestibular-reference-axis-sign",
    title: "Vestibular Reference Axis Sign Tool",
    description:
      "Reorient supplied bench trace components under independent explicit axis-sign flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yaw: { type: "number" },
        pitch: { type: "number" },
        roll: { type: "number" },
        reverseYaw: { type: "boolean" },
        reversePitch: { type: "boolean" },
        reverseRoll: { type: "boolean" },
      },
      required: [
        "yaw",
        "pitch",
        "roll",
        "reverseYaw",
        "reversePitch",
        "reverseRoll",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yaw: { type: "number" },
        pitch: { type: "number" },
        roll: { type: "number" },
      },
      required: ["yaw", "pitch", "roll"],
    },
    ports: {
      inputs: [
        {
          id: "yaw",
          label: "Yaw",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pitch",
          label: "Pitch",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "roll",
          label: "Roll",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reverseYaw",
          label: "Reverse Yaw",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reversePitch",
          label: "Reverse Pitch",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reverseRoll",
          label: "Reverse Roll",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "yaw", label: "Yaw", valueType: { type: "number" } },
        { id: "pitch", label: "Pitch", valueType: { type: "number" } },
        { id: "roll", label: "Roll", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = vestibularReferenceAxisSignTool.execute;
export default vestibularReferenceAxisSignTool;
