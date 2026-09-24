import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly realPermittivity: number;
  readonly lossTangent: number;
};
export type Output = { readonly lossMagnitude: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    realPermittivity: { type: "number", exclusiveMinimum: 0 },
    lossTangent: { type: "number", minimum: 0 },
  },
  required: ["realPermittivity", "lossTangent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lossMagnitude: { type: "number" } },
  required: ["lossMagnitude"],
} as const;
/** Return positive dielectric loss magnitude epsilon real times tan delta; complex-sign convention is left explicit. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { realPermittivity, lossTangent } = input;
  const compute = (): Output => {
    H.positive(realPermittivity);
    H.domain(lossTangent >= 0);
    return { lossMagnitude: realPermittivity * lossTangent };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { realPermittivity: 4, lossTangent: 0.02 },
  output: { lossMagnitude: 0.08 },
} satisfies ToolExample<Input, Output>;
export const dielectricLossTangentImaginaryPermittivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/dielectric-loss-tangent-imaginary-permittivity",
      title: "Dielectric Loss Tangent Imaginary Permittivity Tool",
      description:
        "Return positive dielectric loss magnitude epsilon real times tan delta; complex-sign convention is left explicit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          realPermittivity: { type: "number", exclusiveMinimum: 0 },
          lossTangent: { type: "number", minimum: 0 },
        },
        required: ["realPermittivity", "lossTangent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { lossMagnitude: { type: "number" } },
        required: ["lossMagnitude"],
      },
      ports: {
        inputs: [
          {
            id: "realPermittivity",
            label: "Real Permittivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lossTangent",
            label: "Loss Tangent",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lossMagnitude",
            label: "Loss Magnitude",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = dielectricLossTangentImaginaryPermittivityTool.execute;
export default dielectricLossTangentImaginaryPermittivityTool;
