import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diffusivity: number;
  readonly step: number;
  readonly dimensions: number;
};
export type Output = {
  readonly meanSquareDisplacement: number;
  readonly rmsDisplacement: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diffusivity: { type: "number", minimum: 0 },
    step: { type: "number", minimum: 0 },
    dimensions: { type: "integer", minimum: 1 },
  },
  required: ["diffusivity", "step", "dimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    meanSquareDisplacement: { type: "number" },
    rmsDisplacement: { type: "number" },
  },
  required: ["meanSquareDisplacement", "rmsDisplacement"],
} as const;
/** Calculate diffusion length one timestep factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diffusivity, step, dimensions } = request;
  const compute = (): Output => {
    H.domain(diffusivity >= 0 && step >= 0);
    H.integer(dimensions, 1);
    return {
      meanSquareDisplacement: 2 * dimensions * diffusivity * step,
      rmsDisplacement: Math.sqrt(2 * dimensions * diffusivity * step),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diffusivity: 2, step: 1, dimensions: 1 },
  output: { meanSquareDisplacement: 4, rmsDisplacement: 2 },
} satisfies ToolExample<Input, Output>;
export const diffusionLengthOneTimestepFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/diffusion-length-one-timestep-factor",
    title: "Diffusion Length One Timestep Factor Tool",
    description:
      "Calculate diffusion length one timestep factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diffusivity: { type: "number", minimum: 0 },
        step: { type: "number", minimum: 0 },
        dimensions: { type: "integer", minimum: 1 },
      },
      required: ["diffusivity", "step", "dimensions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        meanSquareDisplacement: { type: "number" },
        rmsDisplacement: { type: "number" },
      },
      required: ["meanSquareDisplacement", "rmsDisplacement"],
    },
    ports: {
      inputs: [
        {
          id: "diffusivity",
          label: "Diffusivity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dimensions",
          label: "Dimensions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "meanSquareDisplacement",
          label: "Mean Square Displacement",
          valueType: { type: "number" },
        },
        {
          id: "rmsDisplacement",
          label: "Rms Displacement",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = diffusionLengthOneTimestepFactorTool.execute;
export default diffusionLengthOneTimestepFactorTool;
