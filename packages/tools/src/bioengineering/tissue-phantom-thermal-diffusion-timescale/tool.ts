import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly diffusivity: number;
  readonly suppliedGeometryFactor: number;
};
export type Output = { readonly timescale: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    diffusivity: { type: "number", exclusiveMinimum: 0 },
    suppliedGeometryFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["length", "diffusivity", "suppliedGeometryFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { timescale: { type: "number" } },
  required: ["timescale"],
} as const;
/** Diffusion time proportional to length squared with an explicit geometry factor, not a heating or treatment recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, diffusivity, suppliedGeometryFactor } = request;
  const compute = (): Output => {
    H.domain(length >= 0);
    H.positive(diffusivity);
    H.positive(suppliedGeometryFactor);
    return { timescale: (suppliedGeometryFactor * length ** 2) / diffusivity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 0.01, diffusivity: 0.000001, suppliedGeometryFactor: 1 },
  output: { timescale: 100.00000000000001 },
} satisfies ToolExample<Input, Output>;
export const tissuePhantomThermalDiffusionTimescaleTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioengineering/tissue-phantom-thermal-diffusion-timescale",
      title: "Tissue Phantom Thermal Diffusion Timescale Tool",
      description:
        "Diffusion time proportional to length squared with an explicit geometry factor, not a heating or treatment recommendation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          length: { type: "number", minimum: 0 },
          diffusivity: { type: "number", exclusiveMinimum: 0 },
          suppliedGeometryFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["length", "diffusivity", "suppliedGeometryFactor"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { timescale: { type: "number" } },
        required: ["timescale"],
      },
      ports: {
        inputs: [
          {
            id: "length",
            label: "Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "diffusivity",
            label: "Diffusivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedGeometryFactor",
            label: "Supplied Geometry Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "timescale",
            label: "Timescale",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = tissuePhantomThermalDiffusionTimescaleTool.execute;
export default tissuePhantomThermalDiffusionTimescaleTool;
