import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequencyHz: number;
  readonly referenceFrequencyHz: number;
};
export type Output = { readonly octaveOffset: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequencyHz: { type: "number", exclusiveMinimum: 0 },
    referenceFrequencyHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["frequencyHz", "referenceFrequencyHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { octaveOffset: { type: "number" } },
  required: ["octaveOffset"],
} as const;
/** Express a positive audiometric frequency relative to a positive reference in signed octaves. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequencyHz, referenceFrequencyHz } = request;
  const compute = (): Output => {
    (H.domain(frequencyHz > 0, "frequencyHz"), frequencyHz);
    (H.domain(referenceFrequencyHz > 0, "referenceFrequencyHz"),
      referenceFrequencyHz);
    return {
      octaveOffset: Math.log2(frequencyHz) - Math.log2(referenceFrequencyHz),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequencyHz: 2000, referenceFrequencyHz: 500 },
  output: { octaveOffset: 2 },
} satisfies ToolExample<Input, Output>;
export const audioMetricFrequencyOctaveOffsetTool = H.defineSchemaCalculation<
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
    id: "audiology/audio-metric-frequency-octave-offset",
    title: "Audio Metric Frequency Octave Offset",
    description:
      "Express a positive audiometric frequency relative to a positive reference in signed octaves.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequencyHz: { type: "number", exclusiveMinimum: 0 },
        referenceFrequencyHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["frequencyHz", "referenceFrequencyHz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { octaveOffset: { type: "number" } },
      required: ["octaveOffset"],
    },
    ports: {
      inputs: [
        {
          id: "frequencyHz",
          label: "Frequency Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceFrequencyHz",
          label: "Reference Frequency Hz",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "octaveOffset",
          label: "Octave Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = audioMetricFrequencyOctaveOffsetTool.execute;
export default audioMetricFrequencyOctaveOffsetTool;
