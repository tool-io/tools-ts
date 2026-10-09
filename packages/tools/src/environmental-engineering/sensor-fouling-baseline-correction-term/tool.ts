import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawReading: number;
  readonly suppliedAdditiveFoulingBias: number;
};
export type Output = { readonly correctedReading: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawReading: { type: "number" },
    suppliedAdditiveFoulingBias: { type: "number" },
  },
  required: ["rawReading", "suppliedAdditiveFoulingBias"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedReading: { type: "number" } },
  required: ["correctedReading"],
} as const;
/** Subtract an explicit additive fouling bias from an environmental sensor reading without deriving a correction or certifying calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawReading, suppliedAdditiveFoulingBias } = request;
  const compute = (): Output => {
    return { correctedReading: rawReading - suppliedAdditiveFoulingBias };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawReading: 15, suppliedAdditiveFoulingBias: 3 },
  output: { correctedReading: 12 },
} satisfies ToolExample<Input, Output>;
export const sensorFoulingBaselineCorrectionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-engineering/sensor-fouling-baseline-correction-term",
      title: "Sensor Fouling Baseline Correction Term Tool",
      description:
        "Subtract an explicit additive fouling bias from an environmental sensor reading without deriving a correction or certifying calibration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawReading: { type: "number" },
          suppliedAdditiveFoulingBias: { type: "number" },
        },
        required: ["rawReading", "suppliedAdditiveFoulingBias"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { correctedReading: { type: "number" } },
        required: ["correctedReading"],
      },
      ports: {
        inputs: [
          {
            id: "rawReading",
            label: "Raw Reading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedAdditiveFoulingBias",
            label: "Supplied Additive Fouling Bias",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctedReading",
            label: "Corrected Reading",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sensorFoulingBaselineCorrectionTermTool.execute;
export default sensorFoulingBaselineCorrectionTermTool;
