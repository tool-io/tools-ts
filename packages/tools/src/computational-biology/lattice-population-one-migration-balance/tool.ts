import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly arrivals: number;
  readonly departures: number;
  readonly births: number;
  readonly deaths: number;
};
export type Output = {
  readonly netMigration: number;
  readonly nextPopulation: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "integer", minimum: 0 },
    arrivals: { type: "integer", minimum: 0 },
    departures: { type: "integer", minimum: 0 },
    births: { type: "integer", minimum: 0 },
    deaths: { type: "integer", minimum: 0 },
  },
  required: ["population", "arrivals", "departures", "births", "deaths"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMigration: { type: "integer" },
    nextPopulation: { type: "integer" },
  },
  required: ["netMigration", "nextPopulation"],
} as const;
/** Calculate lattice population one migration balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, arrivals, departures, births, deaths } = request;
  const compute = (): Output => {
    H.integer(population, 0);
    H.integer(arrivals, 0);
    H.integer(departures, 0, population);
    H.integer(births, 0);
    H.integer(deaths, 0, population + arrivals - departures + births);
    return {
      netMigration: arrivals - departures,
      nextPopulation: population + arrivals - departures + births - deaths,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    population: 100,
    arrivals: 10,
    departures: 20,
    births: 5,
    deaths: 3,
  },
  output: { netMigration: -10, nextPopulation: 92 },
} satisfies ToolExample<Input, Output>;
export const latticePopulationOneMigrationBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "computational-biology/lattice-population-one-migration-balance",
      title: "Lattice Population One Migration Balance Tool",
      description:
        "Calculate lattice population one migration balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          population: { type: "integer", minimum: 0 },
          arrivals: { type: "integer", minimum: 0 },
          departures: { type: "integer", minimum: 0 },
          births: { type: "integer", minimum: 0 },
          deaths: { type: "integer", minimum: 0 },
        },
        required: ["population", "arrivals", "departures", "births", "deaths"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netMigration: { type: "integer" },
          nextPopulation: { type: "integer" },
        },
        required: ["netMigration", "nextPopulation"],
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
            id: "arrivals",
            label: "Arrivals",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "departures",
            label: "Departures",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "births",
            label: "Births",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "deaths",
            label: "Deaths",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "netMigration",
            label: "Net Migration",
            valueType: { type: "integer" },
          },
          {
            id: "nextPopulation",
            label: "Next Population",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = latticePopulationOneMigrationBalanceTool.execute;
export default latticePopulationOneMigrationBalanceTool;
