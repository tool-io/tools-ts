import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly events: number;
  readonly population: number;
  readonly standardPopulation: number;
};
export type Output = { readonly rate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    population: { type: "number", exclusiveMinimum: 0 },
    standardPopulation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["events", "population", "standardPopulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rate: { type: "number" } },
  required: ["rate"],
} as const;
/** Calculate crude rate standard population factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, population, standardPopulation } = request;
  const compute = (): Output => {
    H.integer(events, 0);
    H.positive(population);
    H.positive(standardPopulation);
    return { rate: (events * standardPopulation) / population };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { events: 25, population: 10000, standardPopulation: 100000 },
  output: { rate: 250 },
} satisfies ToolExample<Input, Output>;
export const crudeRateStandardPopulationFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epidemiology/crude-rate-standard-population-factor",
    title: "Crude Rate Standard Population Factor Tool",
    description:
      "Calculate crude rate standard population factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        events: { type: "integer", minimum: 0 },
        population: { type: "number", exclusiveMinimum: 0 },
        standardPopulation: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["events", "population", "standardPopulation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rate: { type: "number" } },
      required: ["rate"],
    },
    ports: {
      inputs: [
        {
          id: "events",
          label: "Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "standardPopulation",
          label: "Standard Population",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "rate", label: "Rate", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = crudeRateStandardPopulationFactorTool.execute;
export default crudeRateStandardPopulationFactorTool;
