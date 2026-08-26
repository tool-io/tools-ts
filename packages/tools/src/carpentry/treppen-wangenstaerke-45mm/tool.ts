import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type StringThicknessRuleInput = {
  readonly treadDepthCm: number;
};

export type StringThicknessRuleOutput = {
  readonly recommendedStringThicknessMm: number;
};

export const stringThicknessRuleExample = {
  input: { treadDepthCm: 28 },
  output: { recommendedStringThicknessMm: 45 },
} satisfies ToolExample<StringThicknessRuleInput, StringThicknessRuleOutput>;

export const stringThicknessRuleTool = createSimpleTool({
  id: "carpentry/treppen-wangenstaerke-45mm",
  title: "String Thickness Rule",
  description:
    "Recommend a stair string thickness of 45 millimeters for tread depths of 26 centimeters or more and 40 millimeters below.",
  inputs: [
    {
      description: "Tread depth in centimeters between 20 and 35.",
      id: "treadDepthCm",
      kind: "number",
      label: "Tread depth",
      maximum: 35,
      minimum: 20,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description:
        "Recommended string thickness in millimeters, 45 at 26 cm tread depth or deeper, otherwise 40.",
      id: "recommendedStringThicknessMm",
      kind: "number",
      label: "Recommended string thickness",
      unit: "mm",
    },
  ],
  calculate: (input) => ({
    recommendedStringThicknessMm:
      (input.treadDepthCm as number) >= 26 ? 45 : 40,
  }),
});
export const runStringThicknessRule = stringThicknessRuleTool.execute;
export default stringThicknessRuleTool;
