import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly combinatorialOrder: number;
};
export type Output = {
  readonly nonnegativeInteger: boolean;
  readonly sufficientPopulation: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "number" },
    combinatorialOrder: { type: "integer", minimum: 0 },
  },
  required: ["population", "combinatorialOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nonnegativeInteger: { type: "boolean" },
    sufficientPopulation: { type: "boolean" },
  },
  required: ["nonnegativeInteger", "sufficientPopulation"],
} as const;
/** Validate the supplied count domain for a combinatorial propensity term without simulating a reaction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, combinatorialOrder } = request;
  const compute = (): Output => {
    H.integer(combinatorialOrder, 0);
    return {
      nonnegativeInteger: Number.isSafeInteger(population) && population >= 0,
      sufficientPopulation:
        Number.isSafeInteger(population) && population >= combinatorialOrder,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { population: 2.5, combinatorialOrder: 2 },
  output: { nonnegativeInteger: false, sufficientPopulation: false },
} satisfies ToolExample<Input, Output>;
export const stochasticPropensityNonintegerFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/stochastic-propensity-noninteger-flag",
    title: "Stochastic Propensity Noninteger Flag Tool",
    description:
      "Validate the supplied count domain for a combinatorial propensity term without simulating a reaction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        population: { type: "number" },
        combinatorialOrder: { type: "integer", minimum: 0 },
      },
      required: ["population", "combinatorialOrder"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nonnegativeInteger: { type: "boolean" },
        sufficientPopulation: { type: "boolean" },
      },
      required: ["nonnegativeInteger", "sufficientPopulation"],
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
          id: "combinatorialOrder",
          label: "Combinatorial Order",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nonnegativeInteger",
          label: "Nonnegative Integer",
          valueType: { type: "boolean" },
        },
        {
          id: "sufficientPopulation",
          label: "Sufficient Population",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = stochasticPropensityNonintegerFlagTool.execute;
export default stochasticPropensityNonintegerFlagTool;
