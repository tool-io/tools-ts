import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly costs: readonly number[];
  readonly categories: readonly string[];
  readonly includedCategories: readonly string[];
};
export type Output = {
  readonly includedCost: number;
  readonly excludedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costs: { type: "array", maxItems: 256, items: { type: "number" } },
    categories: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    includedCategories: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["costs", "categories", "includedCategories"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedCost: { type: "number" },
    excludedCost: { type: "number" },
  },
  required: ["includedCost", "excludedCost"],
} as const;
/** Sum supplied costs under explicit perspective categories, without selecting an economic evaluation perspective. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { costs, categories, includedCategories } = request;
  const compute = (): Output => {
    H.sameLength(costs, categories);
    return {
      includedCost: costs.reduce(
        (s, x, i) => s + (includedCategories.includes(categories[i]) ? x : 0),
        0,
      ),
      excludedCost: costs.reduce(
        (s, x, i) => s + (includedCategories.includes(categories[i]) ? 0 : x),
        0,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    costs: [100, 50, 20],
    categories: ["care", "travel", "productivity"],
    includedCategories: ["care", "travel"],
  },
  output: { includedCost: 150, excludedCost: 20 },
} satisfies ToolExample<Input, Output>;
export const costPerspectiveInclusionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/cost-perspective-inclusion-token",
    title: "Cost Perspective Inclusion Token Tool",
    description:
      "Sum supplied costs under explicit perspective categories, without selecting an economic evaluation perspective.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costs: { type: "array", maxItems: 256, items: { type: "number" } },
        categories: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        includedCategories: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["costs", "categories", "includedCategories"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedCost: { type: "number" },
        excludedCost: { type: "number" },
      },
      required: ["includedCost", "excludedCost"],
    },
    ports: {
      inputs: [
        {
          id: "costs",
          label: "Costs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "categories",
          label: "Categories",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "includedCategories",
          label: "Included Categories",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "includedCost",
          label: "Included Cost",
          valueType: { type: "number" },
        },
        {
          id: "excludedCost",
          label: "Excluded Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = costPerspectiveInclusionTokenTool.execute;
export default costPerspectiveInclusionTokenTool;
