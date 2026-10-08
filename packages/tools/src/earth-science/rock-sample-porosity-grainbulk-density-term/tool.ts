import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryBulkDensity: number;
  readonly grainDensity: number;
};
export type Output = { readonly apparentPorosity: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryBulkDensity: { type: "number", minimum: 0 },
    grainDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dryBulkDensity", "grainDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { apparentPorosity: { type: "number" } },
  required: ["apparentPorosity"],
} as const;
/** Calculate un-clipped apparent porosity 1-dry_bulk_density/grain_density from explicit compatible densities without correcting measurement inconsistencies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryBulkDensity, grainDensity } = request;
  const compute = (): Output => {
    H.domain(dryBulkDensity >= 0, "dryBulkDensity");
    (H.domain(
      Number.isFinite(grainDensity) && grainDensity > 0,
      "grainDensity",
    ),
      grainDensity);
    return { apparentPorosity: 1 - dryBulkDensity / grainDensity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryBulkDensity: 2, grainDensity: 2.5 },
  output: { apparentPorosity: 0.19999999999999996 },
} satisfies ToolExample<Input, Output>;
export const rockSamplePorosityGrainbulkDensityTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "earth-science/rock-sample-porosity-grainbulk-density-term",
      title: "Rock Sample Porosity Grainbulk Density Term Tool",
      description:
        "Calculate un-clipped apparent porosity 1-dry_bulk_density/grain_density from explicit compatible densities without correcting measurement inconsistencies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          dryBulkDensity: { type: "number", minimum: 0 },
          grainDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["dryBulkDensity", "grainDensity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { apparentPorosity: { type: "number" } },
        required: ["apparentPorosity"],
      },
      ports: {
        inputs: [
          {
            id: "dryBulkDensity",
            label: "Dry Bulk Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "grainDensity",
            label: "Grain Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "apparentPorosity",
            label: "Apparent Porosity",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = rockSamplePorosityGrainbulkDensityTermTool.execute;
export default rockSamplePorosityGrainbulkDensityTermTool;
