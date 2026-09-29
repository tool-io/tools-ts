import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reading: number;
  readonly emptyReading: number;
  readonly fullReading: number;
  readonly fullVolume: number;
};
export type Output = {
  readonly fillFraction: number;
  readonly calibratedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reading: { type: "number" },
    emptyReading: { type: "number" },
    fullReading: { type: "number" },
    fullVolume: { type: "number", minimum: 0 },
  },
  required: ["reading", "emptyReading", "fullReading", "fullVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fillFraction: { type: "number" },
    calibratedVolume: { type: "number" },
  },
  required: ["fillFraction", "calibratedVolume"],
} as const;
/** Calculate hydroponic tank level sensor calibration term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reading, emptyReading, fullReading, fullVolume } = request;
  const compute = (): Output => {
    H.domain(fullReading !== emptyReading && fullVolume >= 0);
    return {
      fillFraction: (reading - emptyReading) / (fullReading - emptyReading),
      calibratedVolume:
        ((reading - emptyReading) * fullVolume) / (fullReading - emptyReading),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reading: 3, emptyReading: 1, fullReading: 5, fullVolume: 100 },
  output: { fillFraction: 0.5, calibratedVolume: 50 },
} satisfies ToolExample<Input, Output>;
export const hydroponicTankLevelSensorCalibrationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hydroponics/hydroponic-tank-level-sensor-calibration-term",
      title: "Hydroponic Tank Level Sensor Calibration Term Tool",
      description:
        "Calculate hydroponic tank level sensor calibration term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reading: { type: "number" },
          emptyReading: { type: "number" },
          fullReading: { type: "number" },
          fullVolume: { type: "number", minimum: 0 },
        },
        required: ["reading", "emptyReading", "fullReading", "fullVolume"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fillFraction: { type: "number" },
          calibratedVolume: { type: "number" },
        },
        required: ["fillFraction", "calibratedVolume"],
      },
      ports: {
        inputs: [
          {
            id: "reading",
            label: "Reading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "emptyReading",
            label: "Empty Reading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fullReading",
            label: "Full Reading",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fullVolume",
            label: "Full Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "fillFraction",
            label: "Fill Fraction",
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "calibratedVolume",
            label: "Calibrated Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hydroponicTankLevelSensorCalibrationTermTool.execute;
export default hydroponicTankLevelSensorCalibrationTermTool;
