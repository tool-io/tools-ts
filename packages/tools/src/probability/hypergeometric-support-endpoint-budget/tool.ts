import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly population: number;
  readonly successes: number;
  readonly draws: number;
};
export type Output = {
  readonly minimum: number;
  readonly maximum: number;
  readonly supportSize: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    population: { type: "integer", minimum: 0 },
    successes: { type: "integer", minimum: 0 },
    draws: { type: "integer", minimum: 0 },
  },
  required: ["population", "successes", "draws"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimum: { type: "integer" },
    maximum: { type: "integer" },
    supportSize: { type: "integer" },
  },
  required: ["minimum", "maximum", "supportSize"],
} as const;
/** Calculate hypergeometric support endpoint budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { population, successes, draws } = request;
  const compute = (): Output => {
    H.integer(population, 0);
    H.integer(successes, 0, population);
    H.integer(draws, 0, population);
    return {
      minimum: Math.max(0, draws - (population - successes)),
      maximum: Math.min(draws, successes),
      supportSize:
        Math.min(draws, successes) -
        Math.max(0, draws - (population - successes)) +
        1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { population: 10, successes: 4, draws: 8 },
  output: { minimum: 2, maximum: 4, supportSize: 3 },
} satisfies ToolExample<Input, Output>;
export const hypergeometricSupportEndpointBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "probability/hypergeometric-support-endpoint-budget",
      title: "Hypergeometric Support Endpoint Budget Tool",
      description:
        "Calculate hypergeometric support endpoint budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          population: { type: "integer", minimum: 0 },
          successes: { type: "integer", minimum: 0 },
          draws: { type: "integer", minimum: 0 },
        },
        required: ["population", "successes", "draws"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minimum: { type: "integer" },
          maximum: { type: "integer" },
          supportSize: { type: "integer" },
        },
        required: ["minimum", "maximum", "supportSize"],
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
        ],
        outputs: [
          { id: "minimum", label: "Minimum", valueType: { type: "integer" } },
          { id: "maximum", label: "Maximum", valueType: { type: "integer" } },
          {
            id: "supportSize",
            label: "Support Size",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hypergeometricSupportEndpointBudgetTool.execute;
export default hypergeometricSupportEndpointBudgetTool;
