import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type CloudCeilingCategoryInput = {
  readonly ceilingFt: number;
};

export type CloudCeilingCategoryOutput = {
  readonly category: string;
};

export const cloudCeilingCategoryExample = {
  input: { ceilingFt: 900 },
  output: { category: "marginal" },
} satisfies ToolExample<CloudCeilingCategoryInput, CloudCeilingCategoryOutput>;

export const calculateCloudCeilingCategory = (
  input: CloudCeilingCategoryInput,
): CloudCeilingCategoryOutput => ({
  category:
    input.ceilingFt < 500 ? "low" : input.ceilingFt < 3000 ? "marginal" : "ok",
});

export const cloudCeilingCategoryTool = createSimpleTool({
  calculate: (input) =>
    calculateCloudCeilingCategory(
      input as unknown as CloudCeilingCategoryInput,
    ),
  description:
    "Classify a cloud ceiling as low below five hundred feet, marginal below three thousand feet, or otherwise fine for visual flying rules.",
  id: "sailing/cloud-ceiling-category",
  inputs: [
    {
      description: "Height of the cloud base above the surface.",
      format: "length-ft",
      id: "ceilingFt",
      kind: "integer",
      label: "Ceiling",
      minimum: 0,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "One of low, marginal, or ok describing the ceiling band.",
      id: "category",
      kind: "string",
      label: "Category",
    },
  ],
  title: "Ceiling Category Lookup",
});
export const runCloudCeilingCategory = cloudCeilingCategoryTool.execute;
export default cloudCeilingCategoryTool;
