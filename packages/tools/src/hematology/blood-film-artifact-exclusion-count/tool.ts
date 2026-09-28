import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalCount: number;
  readonly artifacts: number;
  readonly unevaluable: number;
  readonly categoryCount: number;
};
export type Output = {
  readonly eligibleCount: number;
  readonly categoryFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCount: { type: "integer", minimum: 1 },
    artifacts: { type: "integer", minimum: 0 },
    unevaluable: { type: "integer", minimum: 0 },
    categoryCount: { type: "integer", minimum: 0 },
  },
  required: ["totalCount", "artifacts", "unevaluable", "categoryCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCount: { type: "integer" },
    categoryFraction: { type: "number" },
  },
  required: ["eligibleCount", "categoryFraction"],
} as const;
/** Disjoint artifact and unevaluable exclusions for a supplied image-count denominator, without cell classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalCount, artifacts, unevaluable, categoryCount } = request;
  const compute = (): Output => {
    H.integer(totalCount, 1);
    H.integer(artifacts, 0);
    H.integer(unevaluable, 0);
    H.domain(totalCount > artifacts + unevaluable);
    H.integer(categoryCount, 0, totalCount - artifacts - unevaluable);
    return {
      eligibleCount: totalCount - artifacts - unevaluable,
      categoryFraction: categoryCount / (totalCount - artifacts - unevaluable),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalCount: 120, artifacts: 10, unevaluable: 10, categoryCount: 25 },
  output: { eligibleCount: 100, categoryFraction: 0.25 },
} satisfies ToolExample<Input, Output>;
export const bloodFilmArtifactExclusionCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hematology/blood-film-artifact-exclusion-count",
    title: "Blood Film Artifact Exclusion Count Tool",
    description:
      "Disjoint artifact and unevaluable exclusions for a supplied image-count denominator, without cell classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCount: { type: "integer", minimum: 1 },
        artifacts: { type: "integer", minimum: 0 },
        unevaluable: { type: "integer", minimum: 0 },
        categoryCount: { type: "integer", minimum: 0 },
      },
      required: ["totalCount", "artifacts", "unevaluable", "categoryCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCount: { type: "integer" },
        categoryFraction: { type: "number" },
      },
      required: ["eligibleCount", "categoryFraction"],
    },
    ports: {
      inputs: [
        {
          id: "totalCount",
          label: "Total Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "artifacts",
          label: "Artifacts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unevaluable",
          label: "Unevaluable",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "categoryCount",
          label: "Category Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "eligibleCount",
          label: "Eligible Count",
          valueType: { type: "integer" },
        },
        {
          id: "categoryFraction",
          label: "Category Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = bloodFilmArtifactExclusionCountTool.execute;
export default bloodFilmArtifactExclusionCountTool;
