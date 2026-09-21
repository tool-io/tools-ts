import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly category: string;
  readonly suppliedCategories: readonly string[];
  readonly weights: readonly number[];
};
export type Output = { readonly found: boolean; readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    category: { type: "string", maxLength: 8192 },
    suppliedCategories: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["category", "suppliedCategories", "weights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { found: { type: "boolean" }, weight: { type: "number" } },
  required: ["found", "weight"],
} as const;
/** Calculate experience example category weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { category, suppliedCategories, weights } = request;
  const compute = (): Output => {
    H.sameLength(suppliedCategories, weights);
    H.domain(
      new Set(suppliedCategories).size === suppliedCategories.length &&
        weights.every((x) => x >= 0),
    );
    return {
      found: suppliedCategories.includes(category),
      weight: weights[suppliedCategories.indexOf(category)] ?? 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    category: "work",
    suppliedCategories: ["work", "study"],
    weights: [2, 1],
  },
  output: { found: true, weight: 2 },
} satisfies ToolExample<Input, Output>;
export const experienceExampleCategoryWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/experience-example-category-weight",
    title: "Experience Example Category Weight Tool",
    description:
      "Calculate experience example category weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        category: { type: "string", maxLength: 8192 },
        suppliedCategories: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["category", "suppliedCategories", "weights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { found: { type: "boolean" }, weight: { type: "number" } },
      required: ["found", "weight"],
    },
    ports: {
      inputs: [
        {
          id: "category",
          label: "Category",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedCategories",
          label: "Supplied Categories",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "found", label: "Found", valueType: { type: "boolean" } },
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = experienceExampleCategoryWeightTool.execute;
export default experienceExampleCategoryWeightTool;
