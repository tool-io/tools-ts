import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceZeroDegrees: number;
  readonly recordedDegrees: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceZeroDegrees: { type: "number" },
    recordedDegrees: { type: "number" },
  },
  required: ["referenceZeroDegrees", "recordedDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract a supplied reference zero from a recorded motion angle without interpreting motion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceZeroDegrees, recordedDegrees } = request;
  const compute = (): Output => {
    return { signedGap: recordedDegrees - referenceZeroDegrees };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceZeroDegrees: 12, recordedDegrees: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const osteopathicMotionZeroOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["osteopathy", "health and medicine"],
      keywords: ["osteopathy", "health and medicine"],
    },
    id: "osteopathy/osteopathic-motion-zero-offset",
    title: "Osteopathic Motion Zero Offset",
    description:
      "Subtract a supplied reference zero from a recorded motion angle without interpreting motion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceZeroDegrees: { type: "number" },
        recordedDegrees: { type: "number" },
      },
      required: ["referenceZeroDegrees", "recordedDegrees"],
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
          id: "recordedDegrees",
          label: "Recorded Degrees",
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
export const run = osteopathicMotionZeroOffsetTool.execute;
export default osteopathicMotionZeroOffsetTool;
