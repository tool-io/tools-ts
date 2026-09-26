import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earlyVoltage: number;
  readonly lateVoltage: number;
  readonly elapsed: number;
};
export type Output = {
  readonly voltageChange: number;
  readonly meanSlope: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earlyVoltage: { type: "number" },
    lateVoltage: { type: "number" },
    elapsed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["earlyVoltage", "lateVoltage", "elapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voltageChange: { type: "number" },
    meanSlope: { type: "number" },
  },
  required: ["voltageChange", "meanSlope"],
} as const;
/** Observed two-point voltage relaxation secant, not a battery state-of-charge or readiness estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earlyVoltage, lateVoltage, elapsed } = request;
  const compute = (): Output => {
    H.positive(elapsed);
    return {
      voltageChange: lateVoltage - earlyVoltage,
      meanSlope: (lateVoltage - earlyVoltage) / elapsed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earlyVoltage: 4.2, lateVoltage: 4.1, elapsed: 10 },
  output: {
    voltageChange: -0.10000000000000053,
    meanSlope: -0.010000000000000054,
  },
} satisfies ToolExample<Input, Output>;
export const batteryOcvRelaxationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/battery-ocv-relaxation-gap",
    title: "Battery Ocv Relaxation Gap Tool",
    description:
      "Observed two-point voltage relaxation secant, not a battery state-of-charge or readiness estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earlyVoltage: { type: "number" },
        lateVoltage: { type: "number" },
        elapsed: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["earlyVoltage", "lateVoltage", "elapsed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voltageChange: { type: "number" },
        meanSlope: { type: "number" },
      },
      required: ["voltageChange", "meanSlope"],
    },
    ports: {
      inputs: [
        {
          id: "earlyVoltage",
          label: "Early Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lateVoltage",
          label: "Late Voltage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voltageChange",
          label: "Voltage Change",
          valueType: { type: "number" },
        },
        { id: "meanSlope", label: "Mean Slope", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = batteryOcvRelaxationGapTool.execute;
export default batteryOcvRelaxationGapTool;
