import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type VisibilityCategoryInput = {
  readonly visibilityNm: number;
};

export type VisibilityCategoryOutput = {
  readonly category: string;
};

export const visibilityCategoryExample = {
  input: { visibilityNm: 1.2 },
  output: { category: "poor" },
} satisfies ToolExample<VisibilityCategoryInput, VisibilityCategoryOutput>;

export const calculateVisibilityCategory = (
  input: VisibilityCategoryInput,
): VisibilityCategoryOutput => ({
  category:
    input.visibilityNm < 0.5
      ? "fog"
      : input.visibilityNm < 2
        ? "poor"
        : input.visibilityNm < 5
          ? "moderate"
          : "good",
});

export const visibilityCategoryTool = createSimpleTool({
  calculate: (input) =>
    calculateVisibilityCategory(input as unknown as VisibilityCategoryInput),
  description:
    "Classify horizontal visibility in nautical miles into fog, poor, moderate, or good bands used in marine forecasts.",
  id: "sailing/visibility-category",
  inputs: [
    {
      description: "Horizontal visibility distance.",
      format: "length-nm",
      id: "visibilityNm",
      kind: "number",
      label: "Visibility",
      minimum: 0,
      unit: "NM",
    },
  ],
  outputs: [
    {
      description: "One of fog, poor, moderate, or good.",
      id: "category",
      kind: "string",
      label: "Category",
    },
  ],
  title: "Visibility Category Lookup",
});
export const runVisibilityCategory = visibilityCategoryTool.execute;
export default visibilityCategoryTool;
