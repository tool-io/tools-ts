import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredFrequency: number;
  readonly referenceFrequency: number;
  readonly suppliedOctaveOffset: number;
};
export type Output = {
  readonly normalizedFrequency: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredFrequency: { type: "number", exclusiveMinimum: 0 },
    referenceFrequency: { type: "number", exclusiveMinimum: 0 },
    suppliedOctaveOffset: { type: "integer" },
  },
  required: ["measuredFrequency", "referenceFrequency", "suppliedOctaveOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedFrequency: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["normalizedFrequency", "ratio"],
} as const;
/** Compare supplied recorded and reference frequencies after an explicit octave adjustment without retuning audio. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredFrequency, referenceFrequency, suppliedOctaveOffset } =
    request;
  const compute = (): Output => {
    H.positive(measuredFrequency);
    H.positive(referenceFrequency);
    return {
      normalizedFrequency: measuredFrequency * 2 ** suppliedOctaveOffset,
      ratio:
        (measuredFrequency * 2 ** suppliedOctaveOffset) / referenceFrequency,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredFrequency: 220,
    referenceFrequency: 440,
    suppliedOctaveOffset: 1,
  },
  output: { normalizedFrequency: 440, ratio: 1 },
} satisfies ToolExample<Input, Output>;
export const recordingPitchReferenceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/recording-pitch-reference-factor",
    title: "Recording Pitch Reference Factor Tool",
    description:
      "Compare supplied recorded and reference frequencies after an explicit octave adjustment without retuning audio.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredFrequency: { type: "number", exclusiveMinimum: 0 },
        referenceFrequency: { type: "number", exclusiveMinimum: 0 },
        suppliedOctaveOffset: { type: "integer" },
      },
      required: [
        "measuredFrequency",
        "referenceFrequency",
        "suppliedOctaveOffset",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedFrequency: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["normalizedFrequency", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "measuredFrequency",
          label: "Measured Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFrequency",
          label: "Reference Frequency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOctaveOffset",
          label: "Supplied Octave Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "normalizedFrequency",
          label: "Normalized Frequency",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recordingPitchReferenceFactorTool.execute;
export default recordingPitchReferenceFactorTool;
