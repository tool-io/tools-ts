import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rotations: number;
  readonly circumference: number;
  readonly actualDistance: number;
};
export type Output = {
  readonly nominalDistance: number;
  readonly distanceGap: number;
  readonly slipFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rotations: { type: "number", minimum: 0 },
    circumference: { type: "number", minimum: 0 },
    actualDistance: { type: "number", minimum: 0 },
  },
  required: ["rotations", "circumference", "actualDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalDistance: { type: "number" },
    distanceGap: { type: "number" },
    slipFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["nominalDistance", "distanceGap", "slipFraction", "defined"],
} as const;
/** Compare supplied nominal wheel travel to measured travel; signed slip may indicate overtravel. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rotations, circumference, actualDistance } = request;
  const compute = (): Output => {
    H.domain(rotations >= 0 && circumference >= 0 && actualDistance >= 0);
    return {
      nominalDistance: rotations * circumference,
      distanceGap: rotations * circumference - actualDistance,
      slipFraction:
        rotations * circumference > 0
          ? 1 - actualDistance / (rotations * circumference)
          : 0,
      defined: rotations * circumference > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rotations: 10, circumference: 2, actualDistance: 18 },
  output: {
    nominalDistance: 20,
    distanceGap: 2,
    slipFraction: 0.09999999999999998,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const seederWheelCalibrationSlipTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/seeder-wheel-calibration-slip-term",
    title: "Seeder Wheel Calibration Slip Term Tool",
    description:
      "Compare supplied nominal wheel travel to measured travel; signed slip may indicate overtravel.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rotations: { type: "number", minimum: 0 },
        circumference: { type: "number", minimum: 0 },
        actualDistance: { type: "number", minimum: 0 },
      },
      required: ["rotations", "circumference", "actualDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalDistance: { type: "number" },
        distanceGap: { type: "number" },
        slipFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["nominalDistance", "distanceGap", "slipFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "rotations",
          label: "Rotations",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "circumference",
          label: "Circumference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualDistance",
          label: "Actual Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalDistance",
          label: "Nominal Distance",
          valueType: { type: "number" },
        },
        {
          id: "distanceGap",
          label: "Distance Gap",
          valueType: { type: "number" },
        },
        {
          id: "slipFraction",
          label: "Slip Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = seederWheelCalibrationSlipTermTool.execute;
export default seederWheelCalibrationSlipTermTool;
