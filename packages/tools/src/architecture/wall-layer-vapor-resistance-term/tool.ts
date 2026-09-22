import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thickness: number;
  readonly diffusionResistanceFactor: number;
};
export type Output = { readonly equivalentAirThickness: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thickness: { type: "number", minimum: 0 },
    diffusionResistanceFactor: { type: "number", minimum: 0 },
  },
  required: ["thickness", "diffusionResistanceFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentAirThickness: { type: "number" } },
  required: ["equivalentAirThickness"],
} as const;
/** Compute supplied vapor diffusion resistance factor times layer thickness, without predicting condensation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thickness, diffusionResistanceFactor } = request;
  const compute = (): Output => {
    H.domain(thickness >= 0 && diffusionResistanceFactor >= 0);
    return { equivalentAirThickness: thickness * diffusionResistanceFactor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thickness: 0.1, diffusionResistanceFactor: 10 },
  output: { equivalentAirThickness: 1 },
} satisfies ToolExample<Input, Output>;
export const wallLayerVaporResistanceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/wall-layer-vapor-resistance-term",
    title: "Wall Layer Vapor Resistance Term Tool",
    description:
      "Compute supplied vapor diffusion resistance factor times layer thickness, without predicting condensation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thickness: { type: "number", minimum: 0 },
        diffusionResistanceFactor: { type: "number", minimum: 0 },
      },
      required: ["thickness", "diffusionResistanceFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equivalentAirThickness: { type: "number" } },
      required: ["equivalentAirThickness"],
    },
    ports: {
      inputs: [
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diffusionResistanceFactor",
          label: "Diffusion Resistance Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentAirThickness",
          label: "Equivalent Air Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wallLayerVaporResistanceTermTool.execute;
export default wallLayerVaporResistanceTermTool;
