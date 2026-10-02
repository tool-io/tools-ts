import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly layerAreas: readonly number[];
  readonly plotArea: number;
};
export type Output = { readonly layerAreaRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerAreas: { type: "array", maxItems: 256, items: { type: "number" } },
    plotArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["layerAreas", "plotArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { layerAreaRatio: { type: "number" } },
  required: ["layerAreaRatio"],
} as const;
/** Summed layer-area ratio, allowing canopy layers to overlap in projection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { layerAreas, plotArea } = request;
  const compute = (): Output => {
    H.positive(plotArea);
    H.domain(layerAreas.every((x) => x >= 0));
    return { layerAreaRatio: layerAreas.reduce((a, b) => a + b, 0) / plotArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { layerAreas: [20, 40, 60], plotArea: 100 },
  output: { layerAreaRatio: 1.2 },
} satisfies ToolExample<Input, Output>;
export const foodForestLayerCanopyAreaShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "permaculture/food-forest-layer-canopy-area-share",
    title: "Food Forest Layer Canopy Area Share Tool",
    description:
      "Summed layer-area ratio, allowing canopy layers to overlap in projection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerAreas: { type: "array", maxItems: 256, items: { type: "number" } },
        plotArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["layerAreas", "plotArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { layerAreaRatio: { type: "number" } },
      required: ["layerAreaRatio"],
    },
    ports: {
      inputs: [
        {
          id: "layerAreas",
          label: "Layer Areas",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "plotArea",
          label: "Plot Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "layerAreaRatio",
          label: "Layer Area Ratio",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodForestLayerCanopyAreaShareTool.execute;
export default foodForestLayerCanopyAreaShareTool;
