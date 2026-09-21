import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly number[];
  readonly suppliedHeadFactors: readonly number[];
  readonly categoryTokens: readonly string[];
};
export type Output = {
  readonly headEquivalent: number;
  readonly categories: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    suppliedHeadFactors: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    categoryTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["counts", "suppliedHeadFactors", "categoryTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headEquivalent: { type: "number" },
    categories: { type: "integer" },
  },
  required: ["headEquivalent", "categories"],
} as const;
/** Apply supplied category-to-head equivalent factors without choosing statutory livestock units or payment eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { counts, suppliedHeadFactors, categoryTokens } = request;
  const compute = (): Output => {
    H.sameLength(counts, suppliedHeadFactors);
    H.sameLength(counts, categoryTokens);
    H.domain(
      counts.every((x) => x >= 0) &&
        suppliedHeadFactors.every((x) => x >= 0) &&
        new Set(categoryTokens).size === categoryTokens.length,
    );
    return {
      headEquivalent: H.dot(counts, suppliedHeadFactors),
      categories: categoryTokens.length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    counts: [10, 5],
    suppliedHeadFactors: [1, 0.5],
    categoryTokens: ["A", "B"],
  },
  output: { headEquivalent: 12.5, categories: 2 },
} satisfies ToolExample<Input, Output>;
export const livestockSupportHeadUnitTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/livestock-support-head-unit-token",
    title: "Livestock Support Head Unit Token Tool",
    description:
      "Apply supplied category-to-head equivalent factors without choosing statutory livestock units or payment eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counts: { type: "array", maxItems: 256, items: { type: "integer" } },
        suppliedHeadFactors: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        categoryTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["counts", "suppliedHeadFactors", "categoryTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headEquivalent: { type: "number" },
        categories: { type: "integer" },
      },
      required: ["headEquivalent", "categories"],
    },
    ports: {
      inputs: [
        {
          id: "counts",
          label: "Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "suppliedHeadFactors",
          label: "Supplied Head Factors",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "categoryTokens",
          label: "Category Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "headEquivalent",
          label: "Head Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "categories",
          label: "Categories",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = livestockSupportHeadUnitTokenTool.execute;
export default livestockSupportHeadUnitTokenTool;
