import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly measuredHz: number; readonly labeledHz: number };
export type Output = {
  readonly octaveGap: number;
  readonly frequencyRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredHz: { type: "number", exclusiveMinimum: 0 },
    labeledHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["measuredHz", "labeledHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    octaveGap: { type: "number" },
    frequencyRatio: { type: "number" },
  },
  required: ["octaveGap", "frequencyRatio"],
} as const;
/** Frequency-label discrepancy in octaves, without interpreting hearing thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredHz, labeledHz } = request;
  const compute = (): Output => {
    H.positive(measuredHz);
    H.positive(labeledHz);
    return {
      octaveGap: Math.log2(measuredHz / labeledHz),
      frequencyRatio: measuredHz / labeledHz,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredHz: 2000, labeledHz: 1000 },
  output: { octaveGap: 1, frequencyRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const audiogramFrequencyAxisLabelGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "audiology/audiogram-frequency-axis-label-gap",
    title: "Audiogram Frequency Axis Label Gap Tool",
    description:
      "Frequency-label discrepancy in octaves, without interpreting hearing thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredHz: { type: "number", exclusiveMinimum: 0 },
        labeledHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["measuredHz", "labeledHz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        octaveGap: { type: "number" },
        frequencyRatio: { type: "number" },
      },
      required: ["octaveGap", "frequencyRatio"],
    },
    ports: {
      inputs: [
        {
          id: "measuredHz",
          label: "Measured Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labeledHz",
          label: "Labeled Hz",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "octaveGap", label: "Octave Gap", valueType: { type: "number" } },
        {
          id: "frequencyRatio",
          label: "Frequency Ratio",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = audiogramFrequencyAxisLabelGapTool.execute;
export default audiogramFrequencyAxisLabelGapTool;
