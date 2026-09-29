import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly layerThicknesses: readonly number[];
  readonly snowDensities: readonly number[];
  readonly waterDensity: number;
};
export type Output = {
  readonly snowDepth: number;
  readonly waterEquivalentDepth: number;
  readonly equivalentRatio: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    layerThicknesses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    snowDensities: { type: "array", maxItems: 256, items: { type: "number" } },
    waterDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["layerThicknesses", "snowDensities", "waterDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    snowDepth: { type: "number" },
    waterEquivalentDepth: { type: "number" },
    equivalentRatio: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["snowDepth", "waterEquivalentDepth", "equivalentRatio", "defined"],
} as const;
/** Calculate snowpack layer water ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { layerThicknesses, snowDensities, waterDensity } = request;
  const compute = (): Output => {
    H.sameLength(layerThicknesses, snowDensities);
    H.domain([...layerThicknesses, ...snowDensities].every((x) => x >= 0));
    H.positive(waterDensity);
    return (() => {
      const snowDepth = layerThicknesses.reduce((a, b) => a + b, 0),
        waterEquivalentDepth = layerThicknesses.reduce(
          (s, x, i) => s + x * (snowDensities[i] / waterDensity),
          0,
        );
      return {
        snowDepth,
        waterEquivalentDepth,
        equivalentRatio: snowDepth > 0 ? waterEquivalentDepth / snowDepth : 0,
        defined: snowDepth > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    layerThicknesses: [1, 2],
    snowDensities: [100, 200],
    waterDensity: 1000,
  },
  output: {
    snowDepth: 3,
    waterEquivalentDepth: 0.5,
    equivalentRatio: 0.16666666666666666,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const snowpackLayerWaterRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydrometeorology/snowpack-layer-water-ratio",
    title: "Snowpack Layer Water Ratio Tool",
    description:
      "Calculate snowpack layer water ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        layerThicknesses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        snowDensities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        waterDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["layerThicknesses", "snowDensities", "waterDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        snowDepth: { type: "number" },
        waterEquivalentDepth: { type: "number" },
        equivalentRatio: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "snowDepth",
        "waterEquivalentDepth",
        "equivalentRatio",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "layerThicknesses",
          label: "Layer Thicknesses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "snowDensities",
          label: "Snow Densities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "waterDensity",
          label: "Water Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "snowDepth", label: "Snow Depth", valueType: { type: "number" } },
        {
          id: "waterEquivalentDepth",
          label: "Water Equivalent Depth",
          valueType: { type: "number" },
        },
        {
          id: "equivalentRatio",
          label: "Equivalent Ratio",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = snowpackLayerWaterRatioTool.execute;
export default snowpackLayerWaterRatioTool;
