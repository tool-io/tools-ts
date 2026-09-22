import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rms: number; readonly referenceRms: number };
export type Output = {
  readonly amplitudeRatio: number;
  readonly decibelGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rms: { type: "number", exclusiveMinimum: 0 },
    referenceRms: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rms", "referenceRms"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amplitudeRatio: { type: "number" },
    decibelGap: { type: "number" },
  },
  required: ["amplitudeRatio", "decibelGap"],
} as const;
/** Compare supplied bench RMS amplitudes on an explicit reference without exposure or hearing interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rms, referenceRms } = request;
  const compute = (): Output => {
    H.positive(rms);
    H.positive(referenceRms);
    return {
      amplitudeRatio: rms / referenceRms,
      decibelGap: 20 * (Math.log10(rms) - Math.log10(referenceRms)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rms: 2, referenceRms: 1 },
  output: { amplitudeRatio: 2, decibelGap: 6.020599913279624 },
} satisfies ToolExample<Input, Output>;
export const acousticStimulusRmsReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/acoustic-stimulus-rms-reference-gap",
    title: "Acoustic Stimulus RMS Reference Gap Tool",
    description:
      "Compare supplied bench RMS amplitudes on an explicit reference without exposure or hearing interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rms: { type: "number", exclusiveMinimum: 0 },
        referenceRms: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rms", "referenceRms"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amplitudeRatio: { type: "number" },
        decibelGap: { type: "number" },
      },
      required: ["amplitudeRatio", "decibelGap"],
    },
    ports: {
      inputs: [
        {
          id: "rms",
          label: "Rms",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceRms",
          label: "Reference Rms",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "amplitudeRatio",
          label: "Amplitude Ratio",
          valueType: { type: "number" },
        },
        {
          id: "decibelGap",
          label: "Decibel Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = acousticStimulusRmsReferenceGapTool.execute;
export default acousticStimulusRmsReferenceGapTool;
