import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly events: number;
  readonly stratumPopulation: number;
  readonly standardWeight: number;
};
export type Output = {
  readonly stratumRate: number;
  readonly weightedRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    events: { type: "integer", minimum: 0 },
    stratumPopulation: { type: "number", exclusiveMinimum: 0 },
    standardWeight: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["events", "stratumPopulation", "standardWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stratumRate: { type: "number" },
    weightedRate: { type: "number" },
  },
  required: ["stratumRate", "weightedRate"],
} as const;
/** One directly standardized rate contribution; weights across all strata must sum to one externally. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { events, stratumPopulation, standardWeight } = request;
  const compute = (): Output => {
    H.integer(events, 0);
    H.positive(stratumPopulation);
    H.probability(standardWeight);
    return {
      stratumRate: events / stratumPopulation,
      weightedRate: (events * standardWeight) / stratumPopulation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { events: 10, stratumPopulation: 1000, standardWeight: 0.2 },
  output: { stratumRate: 0.01, weightedRate: 0.002 },
} satisfies ToolExample<Input, Output>;
export const directStandardizationOneStratumTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/direct-standardization-one-stratum-term",
      title: "Direct Standardization One Stratum Term Tool",
      description:
        "One directly standardized rate contribution; weights across all strata must sum to one externally.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          events: { type: "integer", minimum: 0 },
          stratumPopulation: { type: "number", exclusiveMinimum: 0 },
          standardWeight: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["events", "stratumPopulation", "standardWeight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          stratumRate: { type: "number" },
          weightedRate: { type: "number" },
        },
        required: ["stratumRate", "weightedRate"],
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
            id: "stratumPopulation",
            label: "Stratum Population",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "standardWeight",
            label: "Standard Weight",
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
            id: "weightedRate",
            label: "Weighted Rate",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = directStandardizationOneStratumTermTool.execute;
export default directStandardizationOneStratumTermTool;
