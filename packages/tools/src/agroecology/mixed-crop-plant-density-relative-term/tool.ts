import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedPlants: number;
  readonly sampledArea: number;
  readonly soleCropDensity: number;
};
export type Output = {
  readonly density: number;
  readonly relativeDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedPlants: { type: "integer", minimum: 0 },
    sampledArea: { type: "number", exclusiveMinimum: 0 },
    soleCropDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedPlants", "sampledArea", "soleCropDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    density: { type: "number" },
    relativeDensity: { type: "number" },
  },
  required: ["density", "relativeDensity"],
} as const;
/** Calculate mixed crop plant density relative term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedPlants, sampledArea, soleCropDensity } = request;
  const compute = (): Output => {
    H.integer(observedPlants, 0);
    H.positive(sampledArea);
    H.positive(soleCropDensity);
    return {
      density: observedPlants / sampledArea,
      relativeDensity: observedPlants / (sampledArea * soleCropDensity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedPlants: 80, sampledArea: 10, soleCropDensity: 10 },
  output: { density: 8, relativeDensity: 0.8 },
} satisfies ToolExample<Input, Output>;
export const mixedCropPlantDensityRelativeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroecology/mixed-crop-plant-density-relative-term",
    title: "Mixed Crop Plant Density Relative Term Tool",
    description:
      "Calculate mixed crop plant density relative term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedPlants: { type: "integer", minimum: 0 },
        sampledArea: { type: "number", exclusiveMinimum: 0 },
        soleCropDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["observedPlants", "sampledArea", "soleCropDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        density: { type: "number" },
        relativeDensity: { type: "number" },
      },
      required: ["density", "relativeDensity"],
    },
    ports: {
      inputs: [
        {
          id: "observedPlants",
          label: "Observed Plants",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampledArea",
          label: "Sampled Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "soleCropDensity",
          label: "Sole Crop Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "density", label: "Density", valueType: { type: "number" } },
        {
          id: "relativeDensity",
          label: "Relative Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mixedCropPlantDensityRelativeTermTool.execute;
export default mixedCropPlantDensityRelativeTermTool;
