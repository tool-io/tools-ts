import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly depth: number;
  readonly dryBulkDensity: number;
  readonly massFraction: number;
};
export type Output = {
  readonly soilMass: number;
  readonly nutrientMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    depth: { type: "number", minimum: 0 },
    dryBulkDensity: { type: "number", minimum: 0 },
    massFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["area", "depth", "dryBulkDensity", "massFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    soilMass: { type: "number" },
    nutrientMass: { type: "number" },
  },
  required: ["soilMass", "nutrientMass"],
} as const;
/** Calculate soil nutrient area depth bulk density term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, depth, dryBulkDensity, massFraction } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && depth >= 0 && dryBulkDensity >= 0);
    H.probability(massFraction);
    return {
      soilMass: area * depth * dryBulkDensity,
      nutrientMass: area * depth * dryBulkDensity * massFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { area: 100, depth: 0.2, dryBulkDensity: 1200, massFraction: 0.001 },
  output: { soilMass: 24000, nutrientMass: 24 },
} satisfies ToolExample<Input, Output>;
export const soilNutrientAreaDepthBulkDensityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/soil-nutrient-area-depth-bulk-density-term",
      title: "Soil Nutrient Area Depth Bulk Density Term Tool",
      description:
        "Calculate soil nutrient area depth bulk density term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          area: { type: "number", minimum: 0 },
          depth: { type: "number", minimum: 0 },
          dryBulkDensity: { type: "number", minimum: 0 },
          massFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["area", "depth", "dryBulkDensity", "massFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          soilMass: { type: "number" },
          nutrientMass: { type: "number" },
        },
        required: ["soilMass", "nutrientMass"],
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
            id: "depth",
            label: "Depth",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dryBulkDensity",
            label: "Dry Bulk Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "massFraction",
            label: "Mass Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
        ],
        outputs: [
          { id: "soilMass", label: "Soil Mass", valueType: { type: "number" } },
          {
            id: "nutrientMass",
            label: "Nutrient Mass",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = soilNutrientAreaDepthBulkDensityTermTool.execute;
export default soilNutrientAreaDepthBulkDensityTermTool;
