import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly diffusivity: number;
  readonly timeStep: number;
  readonly gridWidth: number;
  readonly dimensions: number;
};
export type Output = {
  readonly fourierNumber: number;
  readonly explicitEulerRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diffusivity: { type: "number", minimum: 0 },
    timeStep: { type: "number", minimum: 0 },
    gridWidth: { type: "number", exclusiveMinimum: 0 },
    dimensions: { type: "integer", minimum: 1, maximum: 3 },
  },
  required: ["diffusivity", "timeStep", "gridWidth", "dimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fourierNumber: { type: "number" },
    explicitEulerRatio: { type: "number" },
  },
  required: ["fourierNumber", "explicitEulerRatio"],
} as const;
/** Compute the equal-spacing central-difference explicit Euler diffusion ratio for a supplied dimension count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { diffusivity, timeStep, gridWidth, dimensions } = request;
  const compute = (): Output => {
    H.domain(diffusivity >= 0 && timeStep >= 0);
    H.positive(gridWidth);
    H.integer(dimensions, 1, 3);
    return {
      fourierNumber: (diffusivity * timeStep) / gridWidth ** 2,
      explicitEulerRatio:
        (2 * dimensions * diffusivity * timeStep) / gridWidth ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { diffusivity: 1, timeStep: 0.1, gridWidth: 1, dimensions: 2 },
  output: { fourierNumber: 0.1, explicitEulerRatio: 0.4 },
} satisfies ToolExample<Input, Output>;
export const gridDiffusionStabilityRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-physics/grid-diffusion-stability-ratio",
    title: "Grid Diffusion Stability Ratio Tool",
    description:
      "Compute the equal-spacing central-difference explicit Euler diffusion ratio for a supplied dimension count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diffusivity: { type: "number", minimum: 0 },
        timeStep: { type: "number", minimum: 0 },
        gridWidth: { type: "number", exclusiveMinimum: 0 },
        dimensions: { type: "integer", minimum: 1, maximum: 3 },
      },
      required: ["diffusivity", "timeStep", "gridWidth", "dimensions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fourierNumber: { type: "number" },
        explicitEulerRatio: { type: "number" },
      },
      required: ["fourierNumber", "explicitEulerRatio"],
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
          id: "timeStep",
          label: "Time Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridWidth",
          label: "Grid Width",
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
          id: "fourierNumber",
          label: "Fourier Number",
          valueType: { type: "number" },
        },
        {
          id: "explicitEulerRatio",
          label: "Explicit Euler Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gridDiffusionStabilityRatioTool.execute;
export default gridDiffusionStabilityRatioTool;
