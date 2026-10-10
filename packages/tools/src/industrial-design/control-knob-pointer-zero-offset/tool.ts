import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceZeroDegrees: number;
  readonly recordedPointerDegrees: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceZeroDegrees: { type: "number" },
    recordedPointerDegrees: { type: "number" },
  },
  required: ["referenceZeroDegrees", "recordedPointerDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract an explicit knob-pointer zero angle from a recorded unwrapped angle without calibrating the control. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceZeroDegrees, recordedPointerDegrees } = request;
  const compute = (): Output => {
    return { signedGap: recordedPointerDegrees - referenceZeroDegrees };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceZeroDegrees: 12, recordedPointerDegrees: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const controlKnobPointerZeroOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["industrial-design", "industrial design", "arts and design"],
      keywords: ["industrial design", "arts and design"],
    },
    id: "industrial-design/control-knob-pointer-zero-offset",
    title: "Control Knob Pointer Zero Offset",
    description:
      "Subtract an explicit knob-pointer zero angle from a recorded unwrapped angle without calibrating the control.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceZeroDegrees: { type: "number" },
        recordedPointerDegrees: { type: "number" },
      },
      required: ["referenceZeroDegrees", "recordedPointerDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "referenceZeroDegrees",
          label: "Reference Zero Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedPointerDegrees",
          label: "Recorded Pointer Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = controlKnobPointerZeroOffsetTool.execute;
export default controlKnobPointerZeroOffsetTool;
