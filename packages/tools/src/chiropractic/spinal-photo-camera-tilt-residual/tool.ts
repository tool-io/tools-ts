import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedCameraTiltDegrees: number;
  readonly referenceTiltDegrees: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedCameraTiltDegrees: { type: "number" },
    referenceTiltDegrees: { type: "number" },
  },
  required: ["recordedCameraTiltDegrees", "referenceTiltDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate reference minus recorded camera tilt in degrees without identifying spinal posture. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedCameraTiltDegrees, referenceTiltDegrees } = request;
  const compute = (): Output => {
    return { signedGap: referenceTiltDegrees - recordedCameraTiltDegrees };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedCameraTiltDegrees: 12, referenceTiltDegrees: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const spinalPhotoCameraTiltResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["chiropractic", "health and medicine"],
      keywords: ["chiropractic", "health and medicine"],
    },
    id: "chiropractic/spinal-photo-camera-tilt-residual",
    title: "Spinal Photo Camera Tilt Residual",
    description:
      "Calculate reference minus recorded camera tilt in degrees without identifying spinal posture.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedCameraTiltDegrees: { type: "number" },
        referenceTiltDegrees: { type: "number" },
      },
      required: ["recordedCameraTiltDegrees", "referenceTiltDegrees"],
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
          id: "recordedCameraTiltDegrees",
          label: "Recorded Camera Tilt Degrees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceTiltDegrees",
          label: "Reference Tilt Degrees",
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
export const run = spinalPhotoCameraTiltResidualTool.execute;
export default spinalPhotoCameraTiltResidualTool;
