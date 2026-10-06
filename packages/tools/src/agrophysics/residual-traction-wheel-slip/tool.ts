import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly theoreticalTravelDistance: number;
  readonly measuredTravelDistance: number;
};
export type Output = { readonly slipFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    theoreticalTravelDistance: { type: "number", exclusiveMinimum: 0 },
    measuredTravelDistance: { type: "number", minimum: 0 },
  },
  required: ["theoreticalTravelDistance", "measuredTravelDistance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { slipFraction: { type: "number" } },
  required: ["slipFraction"],
} as const;
/** Calculate explicit theoretical-minus-measured travel normalized to theoretical travel, preserving negative slip. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { theoreticalTravelDistance, measuredTravelDistance } = request;
  const compute = (): Output => {
    (H.domain(theoreticalTravelDistance > 0, "theoreticalTravelDistance"),
      theoreticalTravelDistance);
    H.domain(measuredTravelDistance >= 0, "measuredTravelDistance");
    return {
      slipFraction: 1 - measuredTravelDistance / theoreticalTravelDistance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { theoreticalTravelDistance: 100, measuredTravelDistance: 85 },
  output: { slipFraction: 0.15000000000000002 },
} satisfies ToolExample<Input, Output>;
export const residualTractionWheelSlipTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrophysics", "agriculture"],
      keywords: ["agrophysics", "agriculture"],
    },
    id: "agrophysics/residual-traction-wheel-slip",
    title: "Residual Traction Wheel Slip",
    description:
      "Calculate explicit theoretical-minus-measured travel normalized to theoretical travel, preserving negative slip.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        theoreticalTravelDistance: { type: "number", exclusiveMinimum: 0 },
        measuredTravelDistance: { type: "number", minimum: 0 },
      },
      required: ["theoreticalTravelDistance", "measuredTravelDistance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { slipFraction: { type: "number" } },
      required: ["slipFraction"],
    },
    ports: {
      inputs: [
        {
          id: "theoreticalTravelDistance",
          label: "Theoretical Travel Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredTravelDistance",
          label: "Measured Travel Distance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "slipFraction",
          label: "Slip Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = residualTractionWheelSlipTool.execute;
export default residualTractionWheelSlipTool;
