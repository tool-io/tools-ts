import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly tidalVolumeMl: number;
  readonly breathsPerMinute: number;
  readonly deadSpaceMl: number;
};
export type Output = {
  readonly minuteVentilationLiters: number;
  readonly alveolarVentilationLiters: number;
  readonly deadSpaceFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tidalVolumeMl: { type: "number", exclusiveMinimum: 0 },
    breathsPerMinute: { type: "number", minimum: 0 },
    deadSpaceMl: { type: "number", minimum: 0 },
  },
  required: ["tidalVolumeMl", "breathsPerMinute", "deadSpaceMl"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minuteVentilationLiters: { type: "number" },
    alveolarVentilationLiters: { type: "number" },
    deadSpaceFraction: { type: "number" },
  },
  required: [
    "minuteVentilationLiters",
    "alveolarVentilationLiters",
    "deadSpaceFraction",
  ],
} as const;
/** Supplied tidal/dead-space volume and frequency arithmetic, without a ventilation prescription or gas-exchange inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { tidalVolumeMl, breathsPerMinute, deadSpaceMl } = request;
  const compute = (): Output => {
    H.positive(tidalVolumeMl);
    H.domain(
      breathsPerMinute >= 0 && deadSpaceMl >= 0 && deadSpaceMl <= tidalVolumeMl,
    );
    return {
      minuteVentilationLiters: (tidalVolumeMl * breathsPerMinute) / 1000,
      alveolarVentilationLiters:
        ((tidalVolumeMl - deadSpaceMl) * breathsPerMinute) / 1000,
      deadSpaceFraction: deadSpaceMl / tidalVolumeMl,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { tidalVolumeMl: 500, breathsPerMinute: 12, deadSpaceMl: 150 },
  output: {
    minuteVentilationLiters: 6,
    alveolarVentilationLiters: 4.2,
    deadSpaceFraction: 0.3,
  },
} satisfies ToolExample<Input, Output>;
export const respiratoryMinuteVolumeFrequencyFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physiology/respiratory-minute-volume-frequency-factor",
      title: "Respiratory Minute Volume Frequency Factor Tool",
      description:
        "Supplied tidal/dead-space volume and frequency arithmetic, without a ventilation prescription or gas-exchange inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          tidalVolumeMl: { type: "number", exclusiveMinimum: 0 },
          breathsPerMinute: { type: "number", minimum: 0 },
          deadSpaceMl: { type: "number", minimum: 0 },
        },
        required: ["tidalVolumeMl", "breathsPerMinute", "deadSpaceMl"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minuteVentilationLiters: { type: "number" },
          alveolarVentilationLiters: { type: "number" },
          deadSpaceFraction: { type: "number" },
        },
        required: [
          "minuteVentilationLiters",
          "alveolarVentilationLiters",
          "deadSpaceFraction",
        ],
      },
      ports: {
        inputs: [
          {
            id: "tidalVolumeMl",
            label: "Tidal Volume Ml",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "breathsPerMinute",
            label: "Breaths Per Minute",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "deadSpaceMl",
            label: "Dead Space Ml",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "minuteVentilationLiters",
            label: "Minute Ventilation Liters",
            valueType: { type: "number" },
          },
          {
            id: "alveolarVentilationLiters",
            label: "Alveolar Ventilation Liters",
            valueType: { type: "number" },
          },
          {
            id: "deadSpaceFraction",
            label: "Dead Space Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = respiratoryMinuteVolumeFrequencyFactorTool.execute;
export default respiratoryMinuteVolumeFrequencyFactorTool;
