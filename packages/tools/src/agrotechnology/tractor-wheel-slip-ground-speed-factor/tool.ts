import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly theoreticalSpeed: number;
  readonly measuredSpeed: number;
};
export type Output = {
  readonly slipFraction: number;
  readonly speedRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    theoreticalSpeed: { type: "number", exclusiveMinimum: 0 },
    measuredSpeed: { type: "number", minimum: 0 },
  },
  required: ["theoreticalSpeed", "measuredSpeed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    slipFraction: { type: "number" },
    speedRatio: { type: "number" },
  },
  required: ["slipFraction", "speedRatio"],
} as const;
/** Calculate tractor wheel slip ground speed factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { theoreticalSpeed, measuredSpeed } = request;
  const compute = (): Output => {
    H.positive(theoreticalSpeed);
    H.domain(measuredSpeed >= 0);
    return {
      slipFraction: 1 - measuredSpeed / theoreticalSpeed,
      speedRatio: measuredSpeed / theoreticalSpeed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { theoreticalSpeed: 10, measuredSpeed: 8 },
  output: { slipFraction: 0.19999999999999996, speedRatio: 0.8 },
} satisfies ToolExample<Input, Output>;
export const tractorWheelSlipGroundSpeedFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrotechnology/tractor-wheel-slip-ground-speed-factor",
    title: "Tractor Wheel Slip Ground Speed Factor Tool",
    description:
      "Calculate tractor wheel slip ground speed factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        theoreticalSpeed: { type: "number", exclusiveMinimum: 0 },
        measuredSpeed: { type: "number", minimum: 0 },
      },
      required: ["theoreticalSpeed", "measuredSpeed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        slipFraction: { type: "number" },
        speedRatio: { type: "number" },
      },
      required: ["slipFraction", "speedRatio"],
    },
    ports: {
      inputs: [
        {
          id: "theoreticalSpeed",
          label: "Theoretical Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredSpeed",
          label: "Measured Speed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "slipFraction",
          label: "Slip Fraction",
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "speedRatio",
          label: "Speed Ratio",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = tractorWheelSlipGroundSpeedFactorTool.execute;
export default tractorWheelSlipGroundSpeedFactorTool;
