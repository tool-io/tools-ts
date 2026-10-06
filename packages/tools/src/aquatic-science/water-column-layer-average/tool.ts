import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly layerThicknesses: readonly number[];
};
export type Output = {
  readonly depthWeightedAverage: number;
  readonly totalDepth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    layerThicknesses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["values", "layerThicknesses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depthWeightedAverage: { type: "number" },
    totalDepth: { type: "number" },
  },
  required: ["depthWeightedAverage", "totalDepth"],
} as const;
/** Average supplied layer values by nonnegative layer thickness for a positive finite total water-column depth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, layerThicknesses } = request;
  const compute = (): Output => {
    H.domain(values.length === layerThicknesses.length, "layerThicknesses");
    H.domain(values.length > 0, "values");
    layerThicknesses.forEach((v) => H.domain(v >= 0, "layerThicknesses"));
    const totalDepth = layerThicknesses.reduce((a, b) => a + b, 0);
    H.domain(totalDepth > 0 && Number.isFinite(totalDepth), "layerThicknesses");
    return {
      depthWeightedAverage: values.reduce(
        (a, v, i) => a + v * (layerThicknesses[i] / totalDepth),
        0,
      ),
      totalDepth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { values: [10, 20], layerThicknesses: [2, 3] },
  output: { depthWeightedAverage: 16, totalDepth: 5 },
} satisfies ToolExample<Input, Output>;
export const waterColumnLayerAverageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "aquatic-science",
        "aquatic science",
        "earth and environmental sciences",
      ],
      keywords: ["aquatic science", "earth and environmental sciences"],
    },
    id: "aquatic-science/water-column-layer-average",
    title: "Water Column Layer Average",
    description:
      "Average supplied layer values by nonnegative layer thickness for a positive finite total water-column depth.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        layerThicknesses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["values", "layerThicknesses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depthWeightedAverage: { type: "number" },
        totalDepth: { type: "number" },
      },
      required: ["depthWeightedAverage", "totalDepth"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "layerThicknesses",
          label: "Layer Thicknesses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "depthWeightedAverage",
          label: "Depth Weighted Average",
          valueType: { type: "number" },
        },
        {
          id: "totalDepth",
          label: "Total Depth",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = waterColumnLayerAverageTool.execute;
export default waterColumnLayerAverageTool;
