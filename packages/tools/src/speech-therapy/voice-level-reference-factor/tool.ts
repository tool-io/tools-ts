import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amplitude: number;
  readonly referenceAmplitude: number;
};
export type Output = {
  readonly ratio: number;
  readonly decibelDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amplitude: { type: "number", exclusiveMinimum: 0 },
    referenceAmplitude: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["amplitude", "referenceAmplitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ratio: { type: "number" },
    decibelDifference: { type: "number" },
  },
  required: ["ratio", "decibelDifference"],
} as const;
/** Compare supplied bench voice amplitudes on an explicit reference; no exposure or clinical threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amplitude, referenceAmplitude } = request;
  const compute = (): Output => {
    H.positive(amplitude);
    H.positive(referenceAmplitude);
    return {
      ratio: amplitude / referenceAmplitude,
      decibelDifference:
        20 * (Math.log10(amplitude) - Math.log10(referenceAmplitude)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { amplitude: 2, referenceAmplitude: 1 },
  output: { ratio: 2, decibelDifference: 6.020599913279624 },
} satisfies ToolExample<Input, Output>;
export const voiceLevelReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/voice-level-reference-factor",
    title: "Voice Level Reference Factor Tool",
    description:
      "Compare supplied bench voice amplitudes on an explicit reference; no exposure or clinical threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amplitude: { type: "number", exclusiveMinimum: 0 },
        referenceAmplitude: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["amplitude", "referenceAmplitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ratio: { type: "number" },
        decibelDifference: { type: "number" },
      },
      required: ["ratio", "decibelDifference"],
    },
    ports: {
      inputs: [
        {
          id: "amplitude",
          label: "Amplitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceAmplitude",
          label: "Reference Amplitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "decibelDifference",
          label: "Decibel Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = voiceLevelReferenceFactorTool.execute;
export default voiceLevelReferenceFactorTool;
