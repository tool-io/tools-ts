import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consumptionPerPerson: number;
  readonly laborIncomePerPerson: number;
  readonly population: number;
};
export type Output = {
  readonly perPersonDeficit: number;
  readonly totalDeficit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumptionPerPerson: { type: "number", minimum: 0 },
    laborIncomePerPerson: { type: "number", minimum: 0 },
    population: { type: "integer", minimum: 0 },
  },
  required: ["consumptionPerPerson", "laborIncomePerPerson", "population"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    perPersonDeficit: { type: "number" },
    totalDeficit: { type: "number" },
  },
  required: ["perPersonDeficit", "totalDeficit"],
} as const;
/** Calculate lifecycle deficit one age term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { consumptionPerPerson, laborIncomePerPerson, population } = request;
  const compute = (): Output => {
    H.domain(consumptionPerPerson >= 0 && laborIncomePerPerson >= 0);
    H.integer(population, 0);
    return {
      perPersonDeficit: consumptionPerPerson - laborIncomePerPerson,
      totalDeficit: (consumptionPerPerson - laborIncomePerPerson) * population,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    consumptionPerPerson: 100,
    laborIncomePerPerson: 60,
    population: 1000,
  },
  output: { perPersonDeficit: 40, totalDeficit: 40000 },
} satisfies ToolExample<Input, Output>;
export const lifecycleDeficitOneAgeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "demographic-economics/lifecycle-deficit-one-age-term",
    title: "Lifecycle Deficit One Age Term Tool",
    description:
      "Calculate lifecycle deficit one age term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumptionPerPerson: { type: "number", minimum: 0 },
        laborIncomePerPerson: { type: "number", minimum: 0 },
        population: { type: "integer", minimum: 0 },
      },
      required: ["consumptionPerPerson", "laborIncomePerPerson", "population"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        perPersonDeficit: { type: "number" },
        totalDeficit: { type: "number" },
      },
      required: ["perPersonDeficit", "totalDeficit"],
    },
    ports: {
      inputs: [
        {
          id: "consumptionPerPerson",
          label: "Consumption Per Person",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "laborIncomePerPerson",
          label: "Labor Income Per Person",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "population",
          label: "Population",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "perPersonDeficit",
          label: "Per Person Deficit",
          valueType: { type: "number" },
        },
        {
          id: "totalDeficit",
          label: "Total Deficit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lifecycleDeficitOneAgeTermTool.execute;
export default lifecycleDeficitOneAgeTermTool;
