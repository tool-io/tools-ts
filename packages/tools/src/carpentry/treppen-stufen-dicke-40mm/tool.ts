import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TreadThicknessRuleInput = {
  readonly spanBetweenStringsCm: number;
};

export type TreadThicknessRuleOutput = {
  readonly recommendedTreadThicknessMm: number;
};

export const treadThicknessRuleExample = {
  input: { spanBetweenStringsCm: 80 },
  output: { recommendedTreadThicknessMm: 40 },
} satisfies ToolExample<TreadThicknessRuleInput, TreadThicknessRuleOutput>;

export const treadThicknessRuleTool = createSimpleTool({
  id: "carpentry/treppen-stufen-dicke-40mm",
  title: "Tread Thickness Rule",
  description:
    "Recommend a stair tread thickness of 40 millimeters for string spans up to 90 centimeters and 50 millimeters beyond.",
  inputs: [
    {
      description: "Span between the strings in centimeters, up to 200.",
      id: "spanBetweenStringsCm",
      kind: "number",
      label: "Span between strings",
      maximum: 200,
      unit: "cm",
    },
  ],
  outputs: [
    {
      description:
        "Recommended tread thickness in millimeters, 40 for spans of at most 90 centimeters, otherwise 50.",
      id: "recommendedTreadThicknessMm",
      kind: "number",
      label: "Recommended tread thickness",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const spanBetweenStringsCm = input.spanBetweenStringsCm as number;
    if (!(spanBetweenStringsCm > 0))
      simpleError(
        "spanBetweenStringsCm",
        "Span between strings must be greater than zero.",
        "must_be_positive",
      );
    return {
      recommendedTreadThicknessMm: spanBetweenStringsCm <= 90 ? 40 : 50,
    };
  },
});
export const runTreadThicknessRule = treadThicknessRuleTool.execute;
export default treadThicknessRuleTool;
