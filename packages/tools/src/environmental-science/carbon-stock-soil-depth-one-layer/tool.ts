import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly thickness: number;
  readonly bulkDensity: number;
  readonly carbonFraction: number;
  readonly coarseFragmentFraction: number;
};
export type Output = { readonly carbonMass: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    thickness: { type: "number", minimum: 0 },
    bulkDensity: { type: "number", minimum: 0 },
    carbonFraction: { type: "number", minimum: 0, maximum: 1 },
    coarseFragmentFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "area",
    "thickness",
    "bulkDensity",
    "carbonFraction",
    "coarseFragmentFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { carbonMass: { type: "number" } },
  required: ["carbonMass"],
} as const;
/** Calculate carbon stock soil depth one layer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    area,
    thickness,
    bulkDensity,
    carbonFraction,
    coarseFragmentFraction,
  } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && thickness >= 0 && bulkDensity >= 0);
    H.probability(carbonFraction);
    H.probability(coarseFragmentFraction);
    return {
      carbonMass:
        area *
        thickness *
        bulkDensity *
        carbonFraction *
        (1 - coarseFragmentFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 100,
    thickness: 0.2,
    bulkDensity: 1500,
    carbonFraction: 0.02,
    coarseFragmentFraction: 0.1,
  },
  output: { carbonMass: 540 },
} satisfies ToolExample<Input, Output>;
export const carbonStockSoilDepthOneLayerTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/carbon-stock-soil-depth-one-layer",
    title: "Carbon Stock Soil Depth One Layer Tool",
    description:
      "Calculate carbon stock soil depth one layer from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        thickness: { type: "number", minimum: 0 },
        bulkDensity: { type: "number", minimum: 0 },
        carbonFraction: { type: "number", minimum: 0, maximum: 1 },
        coarseFragmentFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "area",
        "thickness",
        "bulkDensity",
        "carbonFraction",
        "coarseFragmentFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { carbonMass: { type: "number" } },
      required: ["carbonMass"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bulkDensity",
          label: "Bulk Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "carbonFraction",
          label: "Carbon Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coarseFragmentFraction",
          label: "Coarse Fragment Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "carbonMass",
          label: "Carbon Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = carbonStockSoilDepthOneLayerTool.execute;
export default carbonStockSoilDepthOneLayerTool;
