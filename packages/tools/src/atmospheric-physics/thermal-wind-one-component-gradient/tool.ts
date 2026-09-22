import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gasConstant: number;
  readonly coriolis: number;
  readonly horizontalTemperatureGradient: number;
  readonly pressureRatio: number;
};
export type Output = { readonly velocityDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gasConstant: { type: "number", exclusiveMinimum: 0 },
    coriolis: { type: "number" },
    horizontalTemperatureGradient: { type: "number" },
    pressureRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "gasConstant",
    "coriolis",
    "horizontalTemperatureGradient",
    "pressureRatio",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { velocityDifference: { type: "number" } },
  required: ["velocityDifference"],
} as const;
/** One explicitly oriented log-pressure thermal-wind component; horizontal gradient sign and pressure-ratio order fix the returned sign. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    gasConstant,
    coriolis,
    horizontalTemperatureGradient,
    pressureRatio,
  } = request;
  const compute = (): Output => {
    H.positive(gasConstant);
    H.domain(coriolis !== 0);
    H.positive(pressureRatio);
    return {
      velocityDifference:
        (gasConstant *
          horizontalTemperatureGradient *
          Math.log(pressureRatio)) /
        coriolis,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    gasConstant: 300,
    coriolis: 0.001,
    horizontalTemperatureGradient: 0.00001,
    pressureRatio: 2.718281828459045,
  },
  output: { velocityDifference: 3 },
} satisfies ToolExample<Input, Output>;
export const thermalWindOneComponentGradientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/thermal-wind-one-component-gradient",
    title: "Thermal Wind One Component Gradient Tool",
    description:
      "One explicitly oriented log-pressure thermal-wind component; horizontal gradient sign and pressure-ratio order fix the returned sign.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gasConstant: { type: "number", exclusiveMinimum: 0 },
        coriolis: { type: "number" },
        horizontalTemperatureGradient: { type: "number" },
        pressureRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "gasConstant",
        "coriolis",
        "horizontalTemperatureGradient",
        "pressureRatio",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { velocityDifference: { type: "number" } },
      required: ["velocityDifference"],
    },
    ports: {
      inputs: [
        {
          id: "gasConstant",
          label: "Gas Constant",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coriolis",
          label: "Coriolis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "horizontalTemperatureGradient",
          label: "Horizontal Temperature Gradient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pressureRatio",
          label: "Pressure Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "velocityDifference",
          label: "Velocity Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = thermalWindOneComponentGradientTool.execute;
export default thermalWindOneComponentGradientTool;
