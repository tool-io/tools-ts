import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly peakSample: number;
  readonly startSample: number;
  readonly sampleHz: number;
  readonly displayDelaySeconds: number;
};
export type Output = {
  readonly rawPeakTime: number;
  readonly correctedPeakTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    peakSample: { type: "integer", minimum: 0 },
    startSample: { type: "integer", minimum: 0 },
    sampleHz: { type: "number", exclusiveMinimum: 0 },
    displayDelaySeconds: { type: "number" },
  },
  required: ["peakSample", "startSample", "sampleHz", "displayDelaySeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawPeakTime: { type: "number" },
    correctedPeakTime: { type: "number" },
  },
  required: ["rawPeakTime", "correctedPeakTime"],
} as const;
/** Time offset of a caller-identified waveform peak sample, not automatic peak detection or a clinical timing metric. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { peakSample, startSample, sampleHz, displayDelaySeconds } = request;
  const compute = (): Output => {
    H.integer(peakSample, 0);
    H.integer(startSample, 0);
    H.positive(sampleHz);
    return {
      rawPeakTime: (peakSample - startSample) / sampleHz,
      correctedPeakTime:
        (peakSample - startSample) / sampleHz - displayDelaySeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    peakSample: 250,
    startSample: 100,
    sampleHz: 1000,
    displayDelaySeconds: 0.01,
  },
  output: { rawPeakTime: 0.15, correctedPeakTime: 0.13999999999999999 },
} satisfies ToolExample<Input, Output>;
export const respiratoryFlowPeakSampleOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/respiratory-flow-peak-sample-offset",
    title: "Respiratory Flow Peak Sample Offset Tool",
    description:
      "Time offset of a caller-identified waveform peak sample, not automatic peak detection or a clinical timing metric.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        peakSample: { type: "integer", minimum: 0 },
        startSample: { type: "integer", minimum: 0 },
        sampleHz: { type: "number", exclusiveMinimum: 0 },
        displayDelaySeconds: { type: "number" },
      },
      required: [
        "peakSample",
        "startSample",
        "sampleHz",
        "displayDelaySeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawPeakTime: { type: "number" },
        correctedPeakTime: { type: "number" },
      },
      required: ["rawPeakTime", "correctedPeakTime"],
    },
    ports: {
      inputs: [
        {
          id: "peakSample",
          label: "Peak Sample",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "startSample",
          label: "Start Sample",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleHz",
          label: "Sample Hz",
          required: true,
          valueType: { type: "number", unit: "Hz" },
        },
        {
          id: "displayDelaySeconds",
          label: "Display Delay Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "rawPeakTime",
          label: "Raw Peak Time",
          valueType: { type: "number" },
        },
        {
          id: "correctedPeakTime",
          label: "Corrected Peak Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = respiratoryFlowPeakSampleOffsetTool.execute;
export default respiratoryFlowPeakSampleOffsetTool;
