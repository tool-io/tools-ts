import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleIndex: number;
  readonly sampleHz: number;
  readonly transportDelaySeconds: number;
  readonly processingDelaySeconds: number;
};
export type Output = {
  readonly rawSeconds: number;
  readonly correctedSeconds: number;
  readonly totalDelaySeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleIndex: { type: "integer", minimum: 0 },
    sampleHz: { type: "number", exclusiveMinimum: 0 },
    transportDelaySeconds: { type: "number", minimum: 0 },
    processingDelaySeconds: { type: "number" },
  },
  required: [
    "sampleIndex",
    "sampleHz",
    "transportDelaySeconds",
    "processingDelaySeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawSeconds: { type: "number" },
    correctedSeconds: { type: "number" },
    totalDelaySeconds: { type: "number" },
  },
  required: ["rawSeconds", "correctedSeconds", "totalDelaySeconds"],
} as const;
/** Place a supplied monitor sample after explicit transport and processing delays. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sampleIndex,
    sampleHz,
    transportDelaySeconds,
    processingDelaySeconds,
  } = request;
  const compute = (): Output => {
    H.integer(sampleIndex, 0);
    H.positive(sampleHz);
    H.domain(
      transportDelaySeconds >= 0 && processingDelaySeconds >= 0,
      "transportDelaySeconds",
    );
    return {
      rawSeconds: sampleIndex / sampleHz,
      correctedSeconds:
        sampleIndex / sampleHz - transportDelaySeconds - processingDelaySeconds,
      totalDelaySeconds: transportDelaySeconds + processingDelaySeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sampleIndex: 500,
    sampleHz: 100,
    transportDelaySeconds: 0.3,
    processingDelaySeconds: 0.2,
  },
  output: { rawSeconds: 5, correctedSeconds: 4.5, totalDelaySeconds: 0.5 },
} satisfies ToolExample<Input, Output>;
export const anesthesiaMonitorSampleDelayOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/anesthesia-monitor-sample-delay-offset",
    title: "Anesthesia Monitor Sample Delay Offset Tool",
    description:
      "Place a supplied monitor sample after explicit transport and processing delays.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleIndex: { type: "integer", minimum: 0 },
        sampleHz: { type: "number", exclusiveMinimum: 0 },
        transportDelaySeconds: { type: "number", minimum: 0 },
        processingDelaySeconds: { type: "number" },
      },
      required: [
        "sampleIndex",
        "sampleHz",
        "transportDelaySeconds",
        "processingDelaySeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawSeconds: { type: "number" },
        correctedSeconds: { type: "number" },
        totalDelaySeconds: { type: "number" },
      },
      required: ["rawSeconds", "correctedSeconds", "totalDelaySeconds"],
    },
    ports: {
      inputs: [
        {
          id: "sampleIndex",
          label: "Sample Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampleHz",
          label: "Sample Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "transportDelaySeconds",
          label: "Transport Delay Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "processingDelaySeconds",
          label: "Processing Delay Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rawSeconds",
          label: "Raw Seconds",
          valueType: { type: "number" },
        },
        {
          id: "correctedSeconds",
          label: "Corrected Seconds",
          valueType: { type: "number" },
        },
        {
          id: "totalDelaySeconds",
          label: "Total Delay Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = anesthesiaMonitorSampleDelayOffsetTool.execute;
export default anesthesiaMonitorSampleDelayOffsetTool;
