import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly growthRate: number;
  readonly capacity: number;
  readonly competitor: number;
  readonly competitionCoefficient: number;
};
export type Output = {
  readonly effectiveLoad: number;
  readonly growth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "number", minimum: 0 },
    growthRate: { type: "number" },
    capacity: { type: "number", exclusiveMinimum: 0 },
    competitor: { type: "number", minimum: 0 },
    competitionCoefficient: { type: "number", minimum: 0 },
  },
  required: [
    "population",
    "growthRate",
    "capacity",
    "competitor",
    "competitionCoefficient",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { effectiveLoad: { type: "number" }, growth: { type: "number" } },
  required: ["effectiveLoad", "growth"],
} as const;
/** One continuous Lotka-Volterra competition rate with an explicit cross-species load coefficient; no equilibrium or fitted parameter inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    population,
    growthRate,
    capacity,
    competitor,
    competitionCoefficient,
  } = request;
  const compute = (): Output => {
    H.domain(population >= 0 && competitor >= 0 && competitionCoefficient >= 0);
    H.positive(capacity);
    return {
      effectiveLoad: population + competitionCoefficient * competitor,
      growth:
        growthRate *
        population *
        (1 - (population + competitionCoefficient * competitor) / capacity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    population: 50,
    growthRate: 0.2,
    capacity: 100,
    competitor: 40,
    competitionCoefficient: 0.5,
  },
  output: { effectiveLoad: 70, growth: 3.0000000000000004 },
} satisfies ToolExample<Input, Output>;
export const lotkaVolterraCompetitionOneTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/lotka-volterra-competition-one-term",
    title: "Lotka Volterra Competition One Term Tool",
    description:
      "One continuous Lotka-Volterra competition rate with an explicit cross-species load coefficient; no equilibrium or fitted parameter inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        population: { type: "number", minimum: 0 },
        growthRate: { type: "number" },
        capacity: { type: "number", exclusiveMinimum: 0 },
        competitor: { type: "number", minimum: 0 },
        competitionCoefficient: { type: "number", minimum: 0 },
      },
      required: [
        "population",
        "growthRate",
        "capacity",
        "competitor",
        "competitionCoefficient",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveLoad: { type: "number" },
        growth: { type: "number" },
      },
      required: ["effectiveLoad", "growth"],
    },
    ports: {
      inputs: [
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "growthRate",
          label: "Growth Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "competitor",
          label: "Competitor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "competitionCoefficient",
          label: "Competition Coefficient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveLoad",
          label: "Effective Load",
          valueType: { type: "number" },
        },
        { id: "growth", label: "Growth", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lotkaVolterraCompetitionOneTermTool.execute;
export default lotkaVolterraCompetitionOneTermTool;
