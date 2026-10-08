import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pivotAmplitude: number;
  readonly waveNumber: number;
  readonly pivotWaveNumber: number;
  readonly spectralIndex: number;
};
export type Output = { readonly powerAmplitude: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pivotAmplitude: { type: "number", minimum: 0 },
    waveNumber: { type: "number", exclusiveMinimum: 0 },
    pivotWaveNumber: { type: "number", exclusiveMinimum: 0 },
    spectralIndex: { type: "number" },
  },
  required: [
    "pivotAmplitude",
    "waveNumber",
    "pivotWaveNumber",
    "spectralIndex",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { powerAmplitude: { type: "number" } },
  required: ["powerAmplitude"],
} as const;
/** Evaluate an explicit dimensionless primordial power-law spectrum A_s(k/k_pivot)^(n_s-1) without running or transfer functions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pivotAmplitude, waveNumber, pivotWaveNumber, spectralIndex } =
    request;
  const compute = (): Output => {
    H.domain(pivotAmplitude >= 0, "pivotAmplitude");
    (H.domain(Number.isFinite(waveNumber) && waveNumber > 0, "waveNumber"),
      waveNumber);
    (H.domain(
      Number.isFinite(pivotWaveNumber) && pivotWaveNumber > 0,
      "pivotWaveNumber",
    ),
      pivotWaveNumber);
    return {
      powerAmplitude:
        pivotAmplitude *
        Math.pow(waveNumber / pivotWaveNumber, spectralIndex - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pivotAmplitude: 2,
    waveNumber: 4,
    pivotWaveNumber: 2,
    spectralIndex: 2,
  },
  output: { powerAmplitude: 4 },
} satisfies ToolExample<Input, Output>;
export const primordialSpectrumPivotAmplitudeTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["cosmology", "physics"],
        keywords: ["cosmology", "physics"],
      },
      id: "cosmology/primordial-spectrum-pivot-amplitude-term",
      title: "Primordial Spectrum Pivot Amplitude Term",
      description:
        "Evaluate an explicit dimensionless primordial power-law spectrum A_s(k/k_pivot)^(n_s-1) without running or transfer functions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          pivotAmplitude: { type: "number", minimum: 0 },
          waveNumber: { type: "number", exclusiveMinimum: 0 },
          pivotWaveNumber: { type: "number", exclusiveMinimum: 0 },
          spectralIndex: { type: "number" },
        },
        required: [
          "pivotAmplitude",
          "waveNumber",
          "pivotWaveNumber",
          "spectralIndex",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { powerAmplitude: { type: "number" } },
        required: ["powerAmplitude"],
      },
      ports: {
        inputs: [
          {
            id: "pivotAmplitude",
            label: "Pivot Amplitude",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "waveNumber",
            label: "Wave Number",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "pivotWaveNumber",
            label: "Pivot Wave Number",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "spectralIndex",
            label: "Spectral Index",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "powerAmplitude",
            label: "Power Amplitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = primordialSpectrumPivotAmplitudeTermTool.execute;
export default primordialSpectrumPivotAmplitudeTermTool;
