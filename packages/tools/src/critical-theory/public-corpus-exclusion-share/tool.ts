import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalUnits: number;
  readonly excludedCounts: readonly number[];
  readonly exclusionCategories: readonly string[];
};
export type Output = {
  readonly excludedTotal: number;
  readonly share: number;
  readonly defined: boolean;
  readonly retainedCategories: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalUnits: { type: "integer", minimum: 0 },
    excludedCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    exclusionCategories: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["originalUnits", "excludedCounts", "exclusionCategories"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    excludedTotal: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
    retainedCategories: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["excludedTotal", "share", "defined", "retainedCategories"],
} as const;
/** Measure explicitly counted disjoint exclusions from the original public corpus while retaining supplied categories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalUnits, excludedCounts, exclusionCategories } = request;
  const compute = (): Output => {
    H.integer(originalUnits, 0);
    H.sameLength(excludedCounts, exclusionCategories);
    H.domain(
      excludedCounts.every((x) => x >= 0) &&
        new Set(exclusionCategories).size === exclusionCategories.length &&
        excludedCounts.reduce((a, b) => a + b, 0) <= originalUnits,
    );
    return {
      excludedTotal: excludedCounts.reduce((a, b) => a + b, 0),
      share:
        originalUnits > 0
          ? excludedCounts.reduce((a, b) => a + b, 0) / originalUnits
          : 0,
      defined: originalUnits > 0,
      retainedCategories: exclusionCategories,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalUnits: 100,
    excludedCounts: [10, 15],
    exclusionCategories: ["duplicate", "out-of-scope"],
  },
  output: {
    excludedTotal: 25,
    share: 0.25,
    defined: true,
    retainedCategories: ["duplicate", "out-of-scope"],
  },
} satisfies ToolExample<Input, Output>;
export const publicCorpusExclusionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "critical-theory/public-corpus-exclusion-share",
    title: "Public Corpus Exclusion Share Tool",
    description:
      "Measure explicitly counted disjoint exclusions from the original public corpus while retaining supplied categories.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalUnits: { type: "integer", minimum: 0 },
        excludedCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        exclusionCategories: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["originalUnits", "excludedCounts", "exclusionCategories"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        excludedTotal: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
        retainedCategories: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["excludedTotal", "share", "defined", "retainedCategories"],
    },
    ports: {
      inputs: [
        {
          id: "originalUnits",
          label: "Original Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedCounts",
          label: "Excluded Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "exclusionCategories",
          label: "Exclusion Categories",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "excludedTotal",
          label: "Excluded Total",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        {
          id: "retainedCategories",
          label: "Retained Categories",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = publicCorpusExclusionShareTool.execute;
export default publicCorpusExclusionShareTool;
