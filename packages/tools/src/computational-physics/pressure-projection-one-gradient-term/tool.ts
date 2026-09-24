import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predictedVelocity: number;
  readonly pressureGradient: number;
  readonly density: number;
  readonly step: number;
};
export type Output = {
  readonly correction: number;
  readonly projectedVelocity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedVelocity: { type: "number" },
    pressureGradient: { type: "number" },
    density: { type: "number", exclusiveMinimum: 0 },
    step: { type: "number", minimum: 0 },
  },
  required: ["predictedVelocity", "pressureGradient", "density", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correction: { type: "number" },
    projectedVelocity: { type: "number" },
  },
  required: ["correction", "projectedVelocity"],
} as const;
/** One incompressible pressure-projection velocity correction, with pressure gradient on the same axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predictedVelocity, pressureGradient, density, step } = request;
  const compute = (): Output => {
    H.positive(density);
    H.domain(step >= 0);
    return {
      correction: (-step * pressureGradient) / density,
      projectedVelocity:
        predictedVelocity - (step * pressureGradient) / density,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { predictedVelocity: 3, pressureGradient: 4, density: 2, step: 0.5 },
  output: { correction: -1, projectedVelocity: 2 },
} satisfies ToolExample<Input, Output>;
export const pressureProjectionOneGradientTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/pressure-projection-one-gradient-term",
    title: "Pressure Projection One Gradient Term Tool",
    description:
      "One incompressible pressure-projection velocity correction, with pressure gradient on the same axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedVelocity: { type: "number" },
        pressureGradient: { type: "number" },
        density: { type: "number", exclusiveMinimum: 0 },
        step: { type: "number", minimum: 0 },
      },
      required: ["predictedVelocity", "pressureGradient", "density", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correction: { type: "number" },
        projectedVelocity: { type: "number" },
      },
      required: ["correction", "projectedVelocity"],
    },
    ports: {
      inputs: [
        {
          id: "predictedVelocity",
          label: "Predicted Velocity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pressureGradient",
          label: "Pressure Gradient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
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
          id: "correction",
          label: "Correction",
          valueType: { type: "number" },
        },
        {
          id: "projectedVelocity",
          label: "Projected Velocity",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pressureProjectionOneGradientTermTool.execute;
export default pressureProjectionOneGradientTermTool;
