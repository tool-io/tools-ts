import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly successes: number;
  readonly draws: number;
  readonly count: number;
};
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "integer", minimum: 1, maximum: 1000000 },
    successes: { type: "integer", minimum: 0 },
    draws: { type: "integer", minimum: 0 },
    count: { type: "integer" },
  },
  required: ["population", "successes", "draws", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate hypergeometric adjacent mass ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, successes, draws, count } = request;
  const compute = (): Output => {
    H.integer(population, 1, 1000000);
    H.integer(successes, 0, population);
    H.integer(draws, 0, population);
    H.integer(
      count,
      Math.max(0, draws - (population - successes)),
      Math.min(draws, successes),
    );
    H.domain(count < Math.min(draws, successes));
    return {
      ratio:
        ((successes - count) * (draws - count)) /
        ((count + 1) * (population - successes - draws + count + 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { population: 10, successes: 4, draws: 3, count: 1 },
  output: { ratio: 0.6 },
} satisfies ToolExample<Input, Output>;
export const hypergeometricAdjacentMassRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/hypergeometric-adjacent-mass-ratio",
    title: "Hypergeometric Adjacent Mass Ratio Tool",
    description:
      "Calculate hypergeometric adjacent mass ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        population: { type: "integer", minimum: 1, maximum: 1000000 },
        successes: { type: "integer", minimum: 0 },
        draws: { type: "integer", minimum: 0 },
        count: { type: "integer" },
      },
      required: ["population", "successes", "draws", "count"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
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
          id: "successes",
          label: "Successes",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "draws",
          label: "Draws",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = hypergeometricAdjacentMassRatioTool.execute;
export default hypergeometricAdjacentMassRatioTool;
