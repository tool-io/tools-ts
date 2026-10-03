import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly events: number;
  readonly population: number;
  readonly standardWeight: number;
  readonly rateBase: number;
};
export type Output = {
  readonly stratumRate: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    population: { type: "number", exclusiveMinimum: 0 },
    standardWeight: { type: "number", minimum: 0, maximum: 1 },
    rateBase: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["events", "population", "standardWeight", "rateBase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stratumRate: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["stratumRate", "contribution"],
} as const;
/** One supplied direct-standardization stratum contribution, not an aggregate standardized rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, population, standardWeight, rateBase } = request;
  const compute = (): Output => {
    H.integer(events, 0);
    H.positive(population);
    H.probability(standardWeight);
    H.positive(rateBase);
    return {
      stratumRate: (events * rateBase) / population,
      contribution: (events * rateBase * standardWeight) / population,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    events: 20,
    population: 1000,
    standardWeight: 0.3,
    rateBase: 100000,
  },
  output: { stratumRate: 2000, contribution: 600 },
} satisfies ToolExample<Input, Output>;
export const healthSurveyAgeStandardizedOneStratumTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/health-survey-age-standardized-one-stratum",
      title: "Health Survey Age Standardized One Stratum Tool",
      description:
        "One supplied direct-standardization stratum contribution, not an aggregate standardized rate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          events: { type: "integer", minimum: 0 },
          population: { type: "number", exclusiveMinimum: 0 },
          standardWeight: { type: "number", minimum: 0, maximum: 1 },
          rateBase: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["events", "population", "standardWeight", "rateBase"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stratumRate: { type: "number" },
          contribution: { type: "number" },
        },
        required: ["stratumRate", "contribution"],
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
            id: "standardWeight",
            label: "Standard Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rateBase",
            label: "Rate Base",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "stratumRate",
            label: "Stratum Rate",
            valueType: { type: "number" },
          },
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthSurveyAgeStandardizedOneStratumTool.execute;
export default healthSurveyAgeStandardizedOneStratumTool;
