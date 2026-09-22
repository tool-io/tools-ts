import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly peakAmplitude: number;
  readonly crestFactor: number;
};
export type Output = {
  readonly rmsAmplitude: number;
  readonly peakToPeak: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    peakAmplitude: { type: "number", minimum: 0 },
    crestFactor: { type: "number", minimum: 1 },
  },
  required: ["peakAmplitude", "crestFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rmsAmplitude: { type: "number" },
    peakToPeak: { type: "number" },
  },
  required: ["rmsAmplitude", "peakToPeak"],
} as const;
/** RMS from an explicit peak/RMS crest factor; peak-to-peak assumes symmetric positive and negative peaks. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { peakAmplitude, crestFactor } = request;
  const compute = (): Output => {
    H.domain(peakAmplitude >= 0 && crestFactor >= 1);
    return {
      rmsAmplitude: peakAmplitude / crestFactor,
      peakToPeak: 2 * peakAmplitude,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { peakAmplitude: 10, crestFactor: 2 },
  output: { rmsAmplitude: 5, peakToPeak: 20 },
} satisfies ToolExample<Input, Output>;
export const objectVibrationPeakRmsFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-conservation/object-vibration-peak-rms-factor",
    title: "Object Vibration Peak RMS Factor Tool",
    description:
      "RMS from an explicit peak/RMS crest factor; peak-to-peak assumes symmetric positive and negative peaks.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        peakAmplitude: { type: "number", minimum: 0 },
        crestFactor: { type: "number", minimum: 1 },
      },
      required: ["peakAmplitude", "crestFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rmsAmplitude: { type: "number" },
        peakToPeak: { type: "number" },
      },
      required: ["rmsAmplitude", "peakToPeak"],
    },
    ports: {
      inputs: [
        {
          id: "peakAmplitude",
          label: "Peak Amplitude",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "crestFactor",
          label: "Crest Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "rmsAmplitude",
          label: "Rms Amplitude",
          valueType: { type: "number" },
        },
        {
          id: "peakToPeak",
          label: "Peak To Peak",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = objectVibrationPeakRmsFactorTool.execute;
export default objectVibrationPeakRmsFactorTool;
