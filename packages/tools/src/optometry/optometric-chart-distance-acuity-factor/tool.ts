import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly testDistance: number;
  readonly calibrationDistance: number;
  readonly chartDenominator: number;
  readonly numerator: number;
};
export type Output = {
  readonly adjustedDenominator: number;
  readonly decimalAcuity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    testDistance: { type: "number", exclusiveMinimum: 0 },
    calibrationDistance: { type: "number", exclusiveMinimum: 0 },
    chartDenominator: { type: "number", exclusiveMinimum: 0 },
    numerator: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "testDistance",
    "calibrationDistance",
    "chartDenominator",
    "numerator",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustedDenominator: { type: "number" },
    decimalAcuity: { type: "number" },
  },
  required: ["adjustedDenominator", "decimalAcuity"],
} as const;
/** Scale an explicitly calibrated Snellen chart fraction for a supplied test distance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { testDistance, calibrationDistance, chartDenominator, numerator } =
    request;
  const compute = (): Output => {
    H.positive(testDistance);
    H.positive(calibrationDistance);
    H.positive(chartDenominator);
    H.positive(numerator);
    return {
      adjustedDenominator:
        (chartDenominator * calibrationDistance) / testDistance,
      decimalAcuity:
        (numerator * testDistance) / (chartDenominator * calibrationDistance),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    testDistance: 3,
    calibrationDistance: 6,
    chartDenominator: 12,
    numerator: 6,
  },
  output: { adjustedDenominator: 24, decimalAcuity: 0.25 },
} satisfies ToolExample<Input, Output>;
export const optometricChartDistanceAcuityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "optometry/optometric-chart-distance-acuity-factor",
      title: "Optometric Chart Distance Acuity Factor Tool",
      description:
        "Scale an explicitly calibrated Snellen chart fraction for a supplied test distance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          testDistance: { type: "number", exclusiveMinimum: 0 },
          calibrationDistance: { type: "number", exclusiveMinimum: 0 },
          chartDenominator: { type: "number", exclusiveMinimum: 0 },
          numerator: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "testDistance",
          "calibrationDistance",
          "chartDenominator",
          "numerator",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          adjustedDenominator: { type: "number" },
          decimalAcuity: { type: "number" },
        },
        required: ["adjustedDenominator", "decimalAcuity"],
      },
      ports: {
        inputs: [
          {
            id: "testDistance",
            label: "Test Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "calibrationDistance",
            label: "Calibration Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "chartDenominator",
            label: "Chart Denominator",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "numerator",
            label: "Numerator",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "adjustedDenominator",
            label: "Adjusted Denominator",
            valueType: { type: "number" },
          },
          {
            id: "decimalAcuity",
            label: "Decimal Acuity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = optometricChartDistanceAcuityFactorTool.execute;
export default optometricChartDistanceAcuityFactorTool;
