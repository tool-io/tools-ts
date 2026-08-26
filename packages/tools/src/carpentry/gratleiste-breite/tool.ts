import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CleatWidthRuleInput = {
  readonly panelThicknessMm: number;
};

export type CleatWidthRuleOutput = {
  readonly cleatWidthMm: number;
};

export const cleatWidthExample = {
  input: { panelThicknessMm: 19 },
  output: { cleatWidthMm: 38 },
} satisfies ToolExample<CleatWidthRuleInput, CleatWidthRuleOutput>;

export const cleatWidthTool = createSimpleTool({
  id: "carpentry/gratleiste-breite",
  title: "Cleat Width Rule Calculator",
  description:
    "Compute the cleat width as twice the panel thickness with a 30 mm minimum.",
  inputs: [
    {
      description: "Panel thickness the cleat supports in millimeters.",
      id: "panelThicknessMm",
      kind: "number",
      label: "Panel thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Recommended cleat width in millimeters.",
      id: "cleatWidthMm",
      kind: "number",
      label: "Cleat width",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const panelThicknessMm = input.panelThicknessMm as number;
    if (!(panelThicknessMm > 0))
      simpleError(
        "panelThicknessMm",
        "Panel thickness must be positive.",
        "must_be_positive",
      );
    return { cleatWidthMm: Math.max(30, 2 * panelThicknessMm) };
  },
});
export const runCleatWidth = cleatWidthTool.execute;
export default cleatWidthTool;
