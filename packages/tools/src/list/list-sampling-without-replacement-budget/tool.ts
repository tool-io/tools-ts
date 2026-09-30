import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly selected: number;
  readonly requested: number;
};
export type Output = { readonly available: number; readonly feasible: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "integer", minimum: 0 },
    selected: { type: "integer", minimum: 0 },
    requested: { type: "integer", minimum: 0 },
  },
  required: ["population", "selected", "requested"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "integer" }, feasible: { type: "boolean" } },
  required: ["available", "feasible"],
} as const;
/** Calculate list sampling without replacement budget from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { population, selected, requested } = input;
  const compute = (): Output => {
    H.integer(population, 0);
    H.integer(selected, 0, population);
    H.integer(requested, 0);
    const available = population - selected;
    return { available, feasible: requested <= available };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { population: 10, selected: 4, requested: 7 },
  output: { available: 6, feasible: false },
} satisfies ToolExample<Input, Output>;
export const listSamplingWithoutReplacementBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "list/list-sampling-without-replacement-budget",
      title: "List Sampling Without Replacement Budget Tool",
      description:
        "Calculate list sampling without replacement budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          population: { type: "integer", minimum: 0 },
          selected: { type: "integer", minimum: 0 },
          requested: { type: "integer", minimum: 0 },
        },
        required: ["population", "selected", "requested"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          available: { type: "integer" },
          feasible: { type: "boolean" },
        },
        required: ["available", "feasible"],
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
            id: "selected",
            label: "Selected",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "requested",
            label: "Requested",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "available",
            label: "Available",
            valueType: { type: "integer" },
          },
          { id: "feasible", label: "Feasible", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = listSamplingWithoutReplacementBudgetTool.execute;
export default listSamplingWithoutReplacementBudgetTool;
