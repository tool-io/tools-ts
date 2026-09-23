import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly samples: readonly number[];
  readonly baseline: number;
  readonly sampleSeconds: number;
};
export type Output = {
  readonly baselineCorrected: readonly number[];
  readonly signedArea: number;
  readonly meanCorrected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    samples: { type: "array", maxItems: 256, items: { type: "number" } },
    baseline: { type: "number" },
    sampleSeconds: { type: "number", minimum: 0 },
  },
  required: ["samples", "baseline", "sampleSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baselineCorrected: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    signedArea: { type: "number" },
    meanCorrected: { type: "number" },
  },
  required: ["baselineCorrected", "signedArea", "meanCorrected"],
} as const;
/** Supplied beat-window baseline subtraction and rectangular sample integration; no beat detection or physiologic waveform interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { samples, baseline, sampleSeconds } = request;
  const compute = (): Output => {
    H.domain(samples.length > 0 && sampleSeconds >= 0);
    return {
      baselineCorrected: samples.map((x) => x - baseline),
      signedArea:
        samples.reduce((sum, x) => sum + x - baseline, 0) * sampleSeconds,
      meanCorrected:
        samples.reduce((sum, x) => sum + x - baseline, 0) / samples.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { samples: [2, 4, 6], baseline: 2, sampleSeconds: 0.1 },
  output: {
    baselineCorrected: [0, 2, 4],
    signedArea: 0.6000000000000001,
    meanCorrected: 2,
  },
} satisfies ToolExample<Input, Output>;
export const cardiologyWaveformOneBeatBaselineTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/cardiology-waveform-one-beat-baseline",
    title: "Cardiology Waveform One Beat Baseline Tool",
    description:
      "Supplied beat-window baseline subtraction and rectangular sample integration; no beat detection or physiologic waveform interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        samples: { type: "array", maxItems: 256, items: { type: "number" } },
        baseline: { type: "number" },
        sampleSeconds: { type: "number", minimum: 0 },
      },
      required: ["samples", "baseline", "sampleSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baselineCorrected: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        signedArea: { type: "number" },
        meanCorrected: { type: "number" },
      },
      required: ["baselineCorrected", "signedArea", "meanCorrected"],
    },
    ports: {
      inputs: [
        {
          id: "samples",
          label: "Samples",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampleSeconds",
          label: "Sample Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "baselineCorrected",
          label: "Baseline Corrected",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "signedArea",
          label: "Signed Area",
          valueType: { type: "number" },
        },
        {
          id: "meanCorrected",
          label: "Mean Corrected",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cardiologyWaveformOneBeatBaselineTool.execute;
export default cardiologyWaveformOneBeatBaselineTool;
