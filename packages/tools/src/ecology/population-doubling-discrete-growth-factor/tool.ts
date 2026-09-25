import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly annualFraction: number;
  readonly years: number;
  readonly initialPopulation: number;
};
export type Output = {
  readonly factor: number;
  readonly population: number;
  readonly doublingYears: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    annualFraction: { type: "number", exclusiveMinimum: 0 },
    years: { type: "number", minimum: 0 },
    initialPopulation: { type: "number", minimum: 0 },
  },
  required: ["annualFraction", "years", "initialPopulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    factor: { type: "number" },
    population: { type: "number" },
    doublingYears: { type: "number" },
  },
  required: ["factor", "population", "doublingYears"],
} as const;
/** Positive discrete annual growth and doubling time under a constant supplied fractional growth rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { annualFraction, years, initialPopulation } = request;
  const compute = (): Output => {
    H.positive(annualFraction);
    H.domain(years >= 0 && initialPopulation >= 0);
    return {
      factor: (1 + annualFraction) ** years,
      population: initialPopulation * (1 + annualFraction) ** years,
      doublingYears: Math.LN2 / Math.log1p(annualFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { annualFraction: 1, years: 3, initialPopulation: 100 },
  output: { factor: 8, population: 800, doublingYears: 1 },
} satisfies ToolExample<Input, Output>;
export const populationDoublingDiscreteGrowthFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "ecology/population-doubling-discrete-growth-factor",
      title: "Population Doubling Discrete Growth Factor Tool",
      description:
        "Positive discrete annual growth and doubling time under a constant supplied fractional growth rate.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          annualFraction: { type: "number", exclusiveMinimum: 0 },
          years: { type: "number", minimum: 0 },
          initialPopulation: { type: "number", minimum: 0 },
        },
        required: ["annualFraction", "years", "initialPopulation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          factor: { type: "number" },
          population: { type: "number" },
          doublingYears: { type: "number" },
        },
        required: ["factor", "population", "doublingYears"],
      },
      ports: {
        inputs: [
          {
            id: "annualFraction",
            label: "Annual Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "years",
            label: "Years",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialPopulation",
            label: "Initial Population",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "factor", label: "Factor", valueType: { type: "number" } },
          {
            id: "population",
            label: "Population",
            valueType: { type: "number" },
          },
          {
            id: "doublingYears",
            label: "Doubling Years",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = populationDoublingDiscreteGrowthFactorTool.execute;
export default populationDoublingDiscreteGrowthFactorTool;
