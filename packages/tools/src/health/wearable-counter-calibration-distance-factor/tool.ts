import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly measuredDistance: number;
  readonly recordedDistance: number;
};
export type Output = {
  readonly perCount: number;
  readonly correctionFactor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 1 },
    measuredDistance: { type: "number", exclusiveMinimum: 0 },
    recordedDistance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["count", "measuredDistance", "recordedDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perCount: { type: "number" },
    correctionFactor: { type: "number" },
  },
  required: ["perCount", "correctionFactor"],
} as const;
/** Calculate wearable counter calibration distance factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, measuredDistance, recordedDistance } = request;
  const compute = (): Output => {
    H.integer(count, 1);
    H.positive(measuredDistance);
    H.positive(recordedDistance);
    return {
      perCount: measuredDistance / count,
      correctionFactor: measuredDistance / recordedDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 1000, measuredDistance: 800, recordedDistance: 750 },
  output: { perCount: 0.8, correctionFactor: 1.0666666666666667 },
} satisfies ToolExample<Input, Output>;
export const wearableCounterCalibrationDistanceFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/wearable-counter-calibration-distance-factor",
      title: "Wearable Counter Calibration Distance Factor Tool",
      description:
        "Calculate wearable counter calibration distance factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "integer", minimum: 1 },
          measuredDistance: { type: "number", exclusiveMinimum: 0 },
          recordedDistance: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["count", "measuredDistance", "recordedDistance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          perCount: { type: "number" },
          correctionFactor: { type: "number" },
        },
        required: ["perCount", "correctionFactor"],
      },
      ports: {
        inputs: [
          {
            id: "count",
            label: "Count",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "measuredDistance",
            label: "Measured Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recordedDistance",
            label: "Recorded Distance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "perCount", label: "Per Count", valueType: { type: "number" } },
          {
            id: "correctionFactor",
            label: "Correction Factor",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = wearableCounterCalibrationDistanceFactorTool.execute;
export default wearableCounterCalibrationDistanceFactorTool;
