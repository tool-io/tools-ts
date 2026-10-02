import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly flowVolumePerSecond: number;
  readonly radius: number;
};
export type Output = {
  readonly meanVelocity: number;
  readonly wallShearRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flowVolumePerSecond: { type: "number" },
    radius: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["flowVolumePerSecond", "radius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanVelocity: { type: "number" },
    wallShearRate: { type: "number" },
  },
  required: ["meanVelocity", "wallShearRate"],
} as const;
/** Ideal fully developed laminar Newtonian circular-tube wall shear-rate approximation, preserving signed flow and coherent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flowVolumePerSecond, radius } = request;
  const compute = (): Output => {
    H.positive(radius);
    return {
      meanVelocity: flowVolumePerSecond / (Math.PI * radius ** 2),
      wallShearRate: (4 * flowVolumePerSecond) / (Math.PI * radius ** 3),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flowVolumePerSecond: 3.141592653589793, radius: 1 },
  output: { meanVelocity: 1, wallShearRate: 4 },
} satisfies ToolExample<Input, Output>;
export const bloodFlowShearRateRadiusFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physiology/blood-flow-shear-rate-radius-factor",
    title: "Blood Flow Shear Rate Radius Factor Tool",
    description:
      "Ideal fully developed laminar Newtonian circular-tube wall shear-rate approximation, preserving signed flow and coherent units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flowVolumePerSecond: { type: "number" },
        radius: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["flowVolumePerSecond", "radius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanVelocity: { type: "number" },
        wallShearRate: { type: "number" },
      },
      required: ["meanVelocity", "wallShearRate"],
    },
    ports: {
      inputs: [
        {
          id: "flowVolumePerSecond",
          label: "Flow Volume Per Second",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "meanVelocity",
          label: "Mean Velocity",
          valueType: { type: "number" },
        },
        {
          id: "wallShearRate",
          label: "Wall Shear Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bloodFlowShearRateRadiusFactorTool.execute;
export default bloodFlowShearRateRadiusFactorTool;
