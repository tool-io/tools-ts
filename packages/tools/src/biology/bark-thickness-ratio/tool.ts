import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BarkThicknessRatioInput = {
  readonly barkThicknessMm: number;
  readonly dbhCm: number;
};

export type BarkThicknessRatioOutput = {
  readonly barkThicknessPercent: number;
};

export const barkThicknessRatioExample = {
  input: { barkThicknessMm: 15, dbhCm: 30 },
  output: { barkThicknessPercent: 5 },
} satisfies ToolExample<BarkThicknessRatioInput, BarkThicknessRatioOutput>;

export const barkThicknessRatioTool = createSimpleTool({
  id: "biology/bark-thickness-ratio",
  title: "Bark Thickness Percent",
  description:
    "Express bark thickness as a percentage of trunk diameter at breast height from millimetres and centimetres.",
  inputs: [
    {
      id: "barkThicknessMm",
      kind: "number",
      label: "Bark thickness",
      minimum: 0,
      unit: "mm",
    },
    {
      id: "dbhCm",
      kind: "number",
      label: "Diameter at breast height",
      unit: "cm",
    },
  ],
  outputs: [
    {
      id: "barkThicknessPercent",
      kind: "number",
      label: "Bark thickness",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const dbhCm = input.dbhCm as number;
    if (!(dbhCm > 0))
      simpleError(
        "dbhCm",
        "The diameter at breast height must be greater than zero.",
      );
    return {
      barkThicknessPercent: ((input.barkThicknessMm as number) / dbhCm) * 10,
    };
  },
});
export const runBarkThicknessRatio = barkThicknessRatioTool.execute;
export default barkThicknessRatioTool;
