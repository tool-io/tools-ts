import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const sawBladeOverstandExample = {
  input: { boardThicknessMm: 19 },
  output: { minimumBladeOverstandMm: 24 },
} satisfies ToolExample<
  { readonly boardThicknessMm: number },
  { readonly minimumBladeOverstandMm: number }
>;

export const sawBladeOverstandTool = createSimpleTool({
  id: "carpentry/kreissaege-blatt-ueberstand-5mm",
  title: "Saw Blade Overstand Calculator",
  description:
    "Compute the minimum circular saw blade overstand so the blade protrudes 5 mm below the board.",
  inputs: [
    {
      description: "Board thickness in millimeters.",
      id: "boardThicknessMm",
      kind: "number",
      label: "Board thickness",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Minimum blade overstand below the board in millimeters.",
      id: "minimumBladeOverstandMm",
      kind: "number",
      label: "Minimum blade overstand",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const boardThicknessMm = input.boardThicknessMm as number;
    if (boardThicknessMm <= 0)
      simpleError(
        "boardThicknessMm",
        "Board thickness must be positive.",
        "must_be_positive",
      );
    return { minimumBladeOverstandMm: boardThicknessMm + 5 };
  },
});
export const runSawBladeOverstand = sawBladeOverstandTool.execute;
export default sawBladeOverstandTool;
