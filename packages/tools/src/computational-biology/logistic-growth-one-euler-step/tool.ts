import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly capacity: number;
  readonly growthRate: number;
  readonly step: number;
};
export type Output = { readonly rate: number; readonly nextPopulation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "number", minimum: 0 },
    capacity: { type: "number", exclusiveMinimum: 0 },
    growthRate: { type: "number", minimum: 0 },
    step: { type: "number", minimum: 0 },
  },
  required: ["population", "capacity", "growthRate", "step"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rate: { type: "number" }, nextPopulation: { type: "number" } },
  required: ["rate", "nextPopulation"],
} as const;
/** One explicit Euler update of the logistic ODE; no clipping or numerical-stability guarantee is added. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, capacity, growthRate, step } = request;
  const compute = (): Output => {
    H.domain(population >= 0 && growthRate >= 0 && step >= 0);
    H.positive(capacity);
    return {
      rate: growthRate * population * (1 - population / capacity),
      nextPopulation:
        population +
        step * growthRate * population * (1 - population / capacity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { population: 20, capacity: 100, growthRate: 0.5, step: 1 },
  output: { rate: 8, nextPopulation: 28 },
} satisfies ToolExample<Input, Output>;
export const logisticGrowthOneEulerStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/logistic-growth-one-euler-step",
    title: "Logistic Growth One Euler Step Tool",
    description:
      "One explicit Euler update of the logistic ODE; no clipping or numerical-stability guarantee is added.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        population: { type: "number", minimum: 0 },
        capacity: { type: "number", exclusiveMinimum: 0 },
        growthRate: { type: "number", minimum: 0 },
        step: { type: "number", minimum: 0 },
      },
      required: ["population", "capacity", "growthRate", "step"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rate: { type: "number" },
        nextPopulation: { type: "number" },
      },
      required: ["rate", "nextPopulation"],
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
          id: "capacity",
          label: "Capacity",
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
          id: "step",
          label: "Step",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "rate", label: "Rate", valueType: { type: "number" } },
        {
          id: "nextPopulation",
          label: "Next Population",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = logisticGrowthOneEulerStepTool.execute;
export default logisticGrowthOneEulerStepTool;
