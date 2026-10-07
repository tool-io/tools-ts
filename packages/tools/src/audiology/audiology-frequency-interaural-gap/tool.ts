import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftEarThreshold: number;
  readonly rightEarThreshold: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftEarThreshold: { type: "number" },
    rightEarThreshold: { type: "number" },
  },
  required: ["leftEarThreshold", "rightEarThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate right-minus-left supplied thresholds at one shared frequency and reference unit without diagnosing asymmetry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftEarThreshold, rightEarThreshold } = request;
  const compute = (): Output => {
    return { signedGap: rightEarThreshold - leftEarThreshold };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftEarThreshold: 12, rightEarThreshold: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const audiologyFrequencyInterauralGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["audiology", "health and medicine"],
      keywords: ["audiology", "health and medicine"],
    },
    id: "audiology/audiology-frequency-interaural-gap",
    title: "Audiology Frequency Interaural Gap",
    description:
      "Calculate right-minus-left supplied thresholds at one shared frequency and reference unit without diagnosing asymmetry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftEarThreshold: { type: "number" },
        rightEarThreshold: { type: "number" },
      },
      required: ["leftEarThreshold", "rightEarThreshold"],
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
          id: "leftEarThreshold",
          label: "Left Ear Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightEarThreshold",
          label: "Right Ear Threshold",
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
export const run = audiologyFrequencyInterauralGapTool.execute;
export default audiologyFrequencyInterauralGapTool;
