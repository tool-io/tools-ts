import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTime: number;
  readonly secondTime: number;
  readonly firstMsd: number;
  readonly secondMsd: number;
  readonly dimensions: number;
};
export type Output = {
  readonly msdSlope: number;
  readonly diffusionEstimate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTime: { type: "number" },
    secondTime: { type: "number" },
    firstMsd: { type: "number", minimum: 0 },
    secondMsd: { type: "number", minimum: 0 },
    dimensions: { type: "integer", minimum: 1, maximum: 3 },
  },
  required: ["firstTime", "secondTime", "firstMsd", "secondMsd", "dimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    msdSlope: { type: "number" },
    diffusionEstimate: { type: "number" },
  },
  required: ["msdSlope", "diffusionEstimate"],
} as const;
/** Estimate a local diffusion coefficient from an explicit MSD-versus-time secant under the Brownian relation MSD = 2dDt; a negative secant remains visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTime, secondTime, firstMsd, secondMsd, dimensions } = request;
  const compute = (): Output => {
    H.domain(
      secondTime > firstTime && firstMsd >= 0 && secondMsd >= 0,
      "secondTime",
    );
    (H.domain(
      Number.isSafeInteger(dimensions) && dimensions >= 1 && dimensions <= 3,
      "dimensions",
    ),
      dimensions);
    return {
      msdSlope: (secondMsd - firstMsd) / (secondTime - firstTime),
      diffusionEstimate:
        (secondMsd - firstMsd) / (secondTime - firstTime) / (2 * dimensions),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstTime: 1,
    secondTime: 3,
    firstMsd: 4,
    secondMsd: 12,
    dimensions: 2,
  },
  output: { msdSlope: 4, diffusionEstimate: 1 },
} satisfies ToolExample<Input, Output>;
export const diffusionMsdLocalSlopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biophysics", "physics"],
      keywords: ["biophysics", "physics"],
    },
    id: "biophysics/diffusion-msd-local-slope",
    title: "Diffusion MSD Local Slope",
    description:
      "Estimate a local diffusion coefficient from an explicit MSD-versus-time secant under the Brownian relation MSD = 2dDt; a negative secant remains visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTime: { type: "number" },
        secondTime: { type: "number" },
        firstMsd: { type: "number", minimum: 0 },
        secondMsd: { type: "number", minimum: 0 },
        dimensions: { type: "integer", minimum: 1, maximum: 3 },
      },
      required: [
        "firstTime",
        "secondTime",
        "firstMsd",
        "secondMsd",
        "dimensions",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        msdSlope: { type: "number" },
        diffusionEstimate: { type: "number" },
      },
      required: ["msdSlope", "diffusionEstimate"],
    },
    ports: {
      inputs: [
        {
          id: "firstTime",
          label: "First Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTime",
          label: "Second Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstMsd",
          label: "First Msd",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMsd",
          label: "Second Msd",
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
        { id: "msdSlope", label: "Msd Slope", valueType: { type: "number" } },
        {
          id: "diffusionEstimate",
          label: "Diffusion Estimate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = diffusionMsdLocalSlopeTool.execute;
export default diffusionMsdLocalSlopeTool;
