import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousMeasurement: number;
  readonly measurement: number;
  readonly previousSetpoint: number;
  readonly setpoint: number;
  readonly derivativeGain: number;
  readonly step: number;
};
export type Output = {
  readonly measurementDerivative: number;
  readonly errorDerivative: number;
  readonly kickDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousMeasurement: { type: "number" },
    measurement: { type: "number" },
    previousSetpoint: { type: "number" },
    setpoint: { type: "number" },
    derivativeGain: { type: "number" },
    step: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "previousMeasurement",
    "measurement",
    "previousSetpoint",
    "setpoint",
    "derivativeGain",
    "step",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measurementDerivative: { type: "number" },
    errorDerivative: { type: "number" },
    kickDifference: { type: "number" },
  },
  required: ["measurementDerivative", "errorDerivative", "kickDifference"],
} as const;
/** Calculate derivative on measurement setpoint gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    previousMeasurement,
    measurement,
    previousSetpoint,
    setpoint,
    derivativeGain,
    step,
  } = request;
  const compute = (): Output => {
    H.positive(step);
    return {
      measurementDerivative:
        (-derivativeGain * (measurement - previousMeasurement)) / step,
      errorDerivative:
        (derivativeGain *
          (setpoint - previousSetpoint - measurement + previousMeasurement)) /
        step,
      kickDifference: (derivativeGain * (setpoint - previousSetpoint)) / step,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previousMeasurement: 10,
    measurement: 12,
    previousSetpoint: 15,
    setpoint: 20,
    derivativeGain: 2,
    step: 1,
  },
  output: { measurementDerivative: -4, errorDerivative: 6, kickDifference: 10 },
} satisfies ToolExample<Input, Output>;
export const derivativeOnMeasurementSetpointGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/derivative-on-measurement-setpoint-gap",
    title: "Derivative On Measurement Setpoint Gap Tool",
    description:
      "Calculate derivative on measurement setpoint gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousMeasurement: { type: "number" },
        measurement: { type: "number" },
        previousSetpoint: { type: "number" },
        setpoint: { type: "number" },
        derivativeGain: { type: "number" },
        step: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "previousMeasurement",
        "measurement",
        "previousSetpoint",
        "setpoint",
        "derivativeGain",
        "step",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measurementDerivative: { type: "number" },
        errorDerivative: { type: "number" },
        kickDifference: { type: "number" },
      },
      required: ["measurementDerivative", "errorDerivative", "kickDifference"],
    },
    ports: {
      inputs: [
        {
          id: "previousMeasurement",
          label: "Previous Measurement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurement",
          label: "Measurement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "previousSetpoint",
          label: "Previous Setpoint",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "setpoint",
          label: "Setpoint",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "derivativeGain",
          label: "Derivative Gain",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "measurementDerivative",
          label: "Measurement Derivative",
          valueType: { type: "number" },
        },
        {
          id: "errorDerivative",
          label: "Error Derivative",
          valueType: { type: "number" },
        },
        {
          id: "kickDifference",
          label: "Kick Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = derivativeOnMeasurementSetpointGapTool.execute;
export default derivativeOnMeasurementSetpointGapTool;
