import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly population: number; readonly cellArea: number };
export type Output = { readonly density: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "integer", minimum: 0 },
    cellArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["population", "cellArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { density: { type: "number" } },
  required: ["density"],
} as const;
/** Calculate population cell density factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, cellArea } = request;
  const compute = (): Output => {
    H.integer(population, 0);
    H.positive(cellArea);
    return { density: population / cellArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { population: 120, cellArea: 3 },
  output: { density: 40 },
} satisfies ToolExample<Input, Output>;
export const populationCellDensityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/population-cell-density-factor",
    title: "Population Cell Density Factor Tool",
    description:
      "Calculate population cell density factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        population: { type: "integer", minimum: 0 },
        cellArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["population", "cellArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { density: { type: "number" } },
      required: ["density"],
    },
    ports: {
      inputs: [
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cellArea",
          label: "Cell Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "density", label: "Density", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = populationCellDensityFactorTool.execute;
export default populationCellDensityFactorTool;
