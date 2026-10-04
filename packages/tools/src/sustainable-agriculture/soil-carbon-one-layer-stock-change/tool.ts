import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly depth: number;
  readonly firstDensity: number;
  readonly secondDensity: number;
  readonly firstCarbon: number;
  readonly secondCarbon: number;
};
export type Output = { readonly stockChange: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    firstDensity: { type: "number", minimum: 0 },
    secondDensity: { type: "number", minimum: 0 },
    firstCarbon: { type: "number", minimum: 0, maximum: 1 },
    secondCarbon: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "area",
    "depth",
    "firstDensity",
    "secondDensity",
    "firstCarbon",
    "secondCarbon",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stockChange: { type: "number" } },
  required: ["stockChange"],
} as const;
/** Fixed-depth change in soil carbon mass: area times depth times the difference in dry bulk density times carbon mass fraction; excludes equivalent-soil-mass correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    area,
    depth,
    firstDensity,
    secondDensity,
    firstCarbon,
    secondCarbon,
  } = request;
  const compute = (): Output => {
    H.domain(
      area >= 0 && depth >= 0 && firstDensity >= 0 && secondDensity >= 0,
    );
    H.probability(firstCarbon);
    H.probability(secondCarbon);
    return {
      stockChange:
        area *
        depth *
        (secondDensity * secondCarbon - firstDensity * firstCarbon),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 100,
    depth: 0.2,
    firstDensity: 1000,
    secondDensity: 1100,
    firstCarbon: 0.01,
    secondCarbon: 0.02,
  },
  output: { stockChange: 240 },
} satisfies ToolExample<Input, Output>;
export const soilCarbonOneLayerStockChangeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/soil-carbon-one-layer-stock-change",
    title: "Soil Carbon One Layer Stock Change Tool",
    description:
      "Fixed-depth change in soil carbon mass: area times depth times the difference in dry bulk density times carbon mass fraction; excludes equivalent-soil-mass correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        depth: { type: "number", minimum: 0 },
        firstDensity: { type: "number", minimum: 0 },
        secondDensity: { type: "number", minimum: 0 },
        firstCarbon: { type: "number", minimum: 0, maximum: 1 },
        secondCarbon: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "area",
        "depth",
        "firstDensity",
        "secondDensity",
        "firstCarbon",
        "secondCarbon",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stockChange: { type: "number" } },
      required: ["stockChange"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number", unit: "m2" },
        },
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "number", unit: "m" },
        },
        {
          id: "firstDensity",
          label: "First Density",
          required: true,
          valueType: { type: "number", unit: "kg/m3" },
        },
        {
          id: "secondDensity",
          label: "Second Density",
          required: true,
          valueType: { type: "number", unit: "kg/m3" },
        },
        {
          id: "firstCarbon",
          label: "First Carbon",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "secondCarbon",
          label: "Second Carbon",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "stockChange",
          label: "Stock Change",
          valueType: { type: "number", unit: "kg" },
        },
      ],
    },
  },
  calculate,
});
export const run = soilCarbonOneLayerStockChangeTool.execute;
export default soilCarbonOneLayerStockChangeTool;
