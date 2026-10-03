import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligible: number;
  readonly covered: number;
  readonly population: number;
};
export type Output = {
  readonly eligibleCoverage: number;
  readonly populationCoverage: number;
  readonly uncovered: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligible: { type: "integer", minimum: 1 },
    covered: { type: "integer", minimum: 0 },
    population: { type: "integer", minimum: 1 },
  },
  required: ["eligible", "covered", "population"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCoverage: { type: "number" },
    populationCoverage: { type: "number" },
    uncovered: { type: "integer" },
  },
  required: ["eligibleCoverage", "populationCoverage", "uncovered"],
} as const;
/** Calculate policy coverage gap one group from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligible, covered, population } = request;
  const compute = (): Output => {
    H.integer(population, 1);
    H.integer(eligible, 1, population);
    H.integer(covered, 0, eligible);
    return {
      eligibleCoverage: covered / eligible,
      populationCoverage: covered / population,
      uncovered: eligible - covered,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eligible: 200, covered: 150, population: 1000 },
  output: { eligibleCoverage: 0.75, populationCoverage: 0.15, uncovered: 50 },
} satisfies ToolExample<Input, Output>;
export const policyCoverageGapOneGroupTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/policy-coverage-gap-one-group",
    title: "Policy Coverage Gap One Group Tool",
    description:
      "Calculate policy coverage gap one group from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligible: { type: "integer", minimum: 1 },
        covered: { type: "integer", minimum: 0 },
        population: { type: "integer", minimum: 1 },
      },
      required: ["eligible", "covered", "population"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCoverage: { type: "number" },
        populationCoverage: { type: "number" },
        uncovered: { type: "integer" },
      },
      required: ["eligibleCoverage", "populationCoverage", "uncovered"],
    },
    ports: {
      inputs: [
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "covered",
          label: "Covered",
          required: true,
          valueType: { type: "integer" },
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
          id: "eligibleCoverage",
          label: "Eligible Coverage",
          valueType: { type: "number" },
        },
        {
          id: "populationCoverage",
          label: "Population Coverage",
          valueType: { type: "number" },
        },
        { id: "uncovered", label: "Uncovered", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = policyCoverageGapOneGroupTool.execute;
export default policyCoverageGapOneGroupTool;
