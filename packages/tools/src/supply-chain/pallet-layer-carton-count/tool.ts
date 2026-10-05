import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cartonsPerLayer: number;
  readonly completeLayers: number;
  readonly partialLayerCartons: number;
};
export type Output = { readonly cartonCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cartonsPerLayer: { type: "integer", minimum: 1 },
    completeLayers: { type: "integer", minimum: 0 },
    partialLayerCartons: { type: "integer", minimum: 0 },
  },
  required: ["cartonsPerLayer", "completeLayers", "partialLayerCartons"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cartonCount: { type: "integer" } },
  required: ["cartonCount"],
} as const;
/** Count cartons in complete identical pallet layers plus one partial layer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cartonsPerLayer, completeLayers, partialLayerCartons } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(cartonsPerLayer) &&
        cartonsPerLayer >= 1 &&
        cartonsPerLayer <= Number.MAX_SAFE_INTEGER,
      "cartonsPerLayer",
    ),
      cartonsPerLayer);
    (H.domain(
      Number.isSafeInteger(completeLayers) &&
        completeLayers >= 0 &&
        completeLayers <= Number.MAX_SAFE_INTEGER,
      "completeLayers",
    ),
      completeLayers);
    (H.domain(
      Number.isSafeInteger(partialLayerCartons) &&
        partialLayerCartons >= 0 &&
        partialLayerCartons <= cartonsPerLayer - 1,
      "partialLayerCartons",
    ),
      partialLayerCartons);
    return {
      cartonCount: cartonsPerLayer * completeLayers + partialLayerCartons,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cartonsPerLayer: 12, completeLayers: 4, partialLayerCartons: 5 },
  output: { cartonCount: 53 },
} satisfies ToolExample<Input, Output>;
export const palletLayerCartonCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/pallet-layer-carton-count",
    title: "Pallet Layer Carton Count Tool",
    description:
      "Count cartons in complete identical pallet layers plus one partial layer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cartonsPerLayer: { type: "integer", minimum: 1 },
        completeLayers: { type: "integer", minimum: 0 },
        partialLayerCartons: { type: "integer", minimum: 0 },
      },
      required: ["cartonsPerLayer", "completeLayers", "partialLayerCartons"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cartonCount: { type: "integer" } },
      required: ["cartonCount"],
    },
    ports: {
      inputs: [
        {
          id: "cartonsPerLayer",
          label: "Cartons Per Layer",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "completeLayers",
          label: "Complete Layers",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "partialLayerCartons",
          label: "Partial Layer Cartons",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "cartonCount",
          label: "Carton Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = palletLayerCartonCountTool.execute;
export default palletLayerCartonCountTool;
