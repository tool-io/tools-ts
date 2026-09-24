import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gradient: number;
  readonly diffusivity: number;
  readonly outwardNormal: number;
};
export type Output = { readonly outwardFlux: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradient: { type: "number" },
    diffusivity: { type: "number", minimum: 0 },
    outwardNormal: { type: "integer" },
  },
  required: ["gradient", "diffusivity", "outwardNormal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { outwardFlux: { type: "number" } },
  required: ["outwardFlux"],
} as const;
/** One-dimensional Fick flux sign under a supplied outward-normal convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gradient, diffusivity, outwardNormal } = request;
  const compute = (): Output => {
    H.domain(diffusivity >= 0 && [1, -1].includes(outwardNormal));
    return { outwardFlux: -diffusivity * gradient * outwardNormal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gradient: 2, diffusivity: 3, outwardNormal: 1 },
  output: { outwardFlux: -6 },
} satisfies ToolExample<Input, Output>;
export const morphogenBoundaryFluxSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/morphogen-boundary-flux-sign",
    title: "Morphogen Boundary Flux Sign Tool",
    description:
      "One-dimensional Fick flux sign under a supplied outward-normal convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gradient: { type: "number" },
        diffusivity: { type: "number", minimum: 0 },
        outwardNormal: { type: "integer" },
      },
      required: ["gradient", "diffusivity", "outwardNormal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { outwardFlux: { type: "number" } },
      required: ["outwardFlux"],
    },
    ports: {
      inputs: [
        {
          id: "gradient",
          label: "Gradient",
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
          id: "outwardNormal",
          label: "Outward Normal",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "outwardFlux",
          label: "Outward Flux",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = morphogenBoundaryFluxSignTool.execute;
export default morphogenBoundaryFluxSignTool;
