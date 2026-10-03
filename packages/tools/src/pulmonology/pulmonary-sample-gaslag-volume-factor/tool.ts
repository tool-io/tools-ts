import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly samplingLineVolume: number;
  readonly sampleFlowPerMinute: number;
  readonly analyzerDelaySeconds: number;
};
export type Output = {
  readonly lineDelaySeconds: number;
  readonly totalDelaySeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samplingLineVolume: { type: "number", minimum: 0 },
    sampleFlowPerMinute: { type: "number", exclusiveMinimum: 0 },
    analyzerDelaySeconds: { type: "number", minimum: 0 },
  },
  required: [
    "samplingLineVolume",
    "sampleFlowPerMinute",
    "analyzerDelaySeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineDelaySeconds: { type: "number" },
    totalDelaySeconds: { type: "number" },
  },
  required: ["lineDelaySeconds", "totalDelaySeconds"],
} as const;
/** Ideal plug-flow sample-line residence plus an explicitly supplied analyzer delay, excluding dispersion or device operating recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { samplingLineVolume, sampleFlowPerMinute, analyzerDelaySeconds } =
    request;
  const compute = (): Output => {
    H.domain(samplingLineVolume >= 0 && analyzerDelaySeconds >= 0);
    H.positive(sampleFlowPerMinute);
    return {
      lineDelaySeconds: (60 * samplingLineVolume) / sampleFlowPerMinute,
      totalDelaySeconds:
        (60 * samplingLineVolume) / sampleFlowPerMinute + analyzerDelaySeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    samplingLineVolume: 2,
    sampleFlowPerMinute: 60,
    analyzerDelaySeconds: 0.5,
  },
  output: { lineDelaySeconds: 2, totalDelaySeconds: 2.5 },
} satisfies ToolExample<Input, Output>;
export const pulmonarySampleGaslagVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pulmonology/pulmonary-sample-gaslag-volume-factor",
    title: "Pulmonary Sample Gaslag Volume Factor Tool",
    description:
      "Ideal plug-flow sample-line residence plus an explicitly supplied analyzer delay, excluding dispersion or device operating recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samplingLineVolume: { type: "number", minimum: 0 },
        sampleFlowPerMinute: { type: "number", exclusiveMinimum: 0 },
        analyzerDelaySeconds: { type: "number", minimum: 0 },
      },
      required: [
        "samplingLineVolume",
        "sampleFlowPerMinute",
        "analyzerDelaySeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineDelaySeconds: { type: "number" },
        totalDelaySeconds: { type: "number" },
      },
      required: ["lineDelaySeconds", "totalDelaySeconds"],
    },
    ports: {
      inputs: [
        {
          id: "samplingLineVolume",
          label: "Sampling Line Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleFlowPerMinute",
          label: "Sample Flow Per Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "analyzerDelaySeconds",
          label: "Analyzer Delay Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "lineDelaySeconds",
          label: "Line Delay Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "totalDelaySeconds",
          label: "Total Delay Seconds",
          valueType: { type: "number", unit: "s" },
        },
      ],
    },
  },
  calculate,
});
export const run = pulmonarySampleGaslagVolumeFactorTool.execute;
export default pulmonarySampleGaslagVolumeFactorTool;
