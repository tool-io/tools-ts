import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly permeability: number;
  readonly thickness: number;
};
export type Output = { readonly resistance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permeability: { type: "number", exclusiveMinimum: 0 },
    thickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["permeability", "thickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { resistance: { type: "number" } },
  required: ["resistance"],
} as const;
/** Convert homogeneous layer vapor permeability to thickness divided by permeability resistance in consistent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { permeability, thickness } = request;
  const compute = (): Output => {
    H.positive(permeability);
    H.positive(thickness);
    return { resistance: thickness / permeability };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { permeability: 2, thickness: 6 },
  output: { resistance: 3 },
} satisfies ToolExample<Input, Output>;
export const vaporPermeabilityResistanceFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/vapor-permeability-resistance-factor",
    title: "Vapor Permeability Resistance Factor Tool",
    description:
      "Convert homogeneous layer vapor permeability to thickness divided by permeability resistance in consistent units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        permeability: { type: "number", exclusiveMinimum: 0 },
        thickness: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["permeability", "thickness"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { resistance: { type: "number" } },
      required: ["resistance"],
    },
    ports: {
      inputs: [
        {
          id: "permeability",
          label: "Permeability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "resistance",
          label: "Resistance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vaporPermeabilityResistanceFactorTool.execute;
export default vaporPermeabilityResistanceFactorTool;
