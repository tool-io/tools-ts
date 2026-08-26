import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type BattenSpacingInput = {
  readonly boardThicknessMm: number;
};

export type BattenSpacingOutput = {
  readonly spacingCm: number;
};

export const battenSpacingExample = {
  input: { boardThicknessMm: 24 },
  output: { spacingCm: 40 },
} satisfies ToolExample<BattenSpacingInput, BattenSpacingOutput>;

export const battenSpacingTool = createSimpleTool({
  id: "carpentry/unterkonstruktion-lattenabstand-30-40cm",
  title: "Batten Spacing Rule",
  description:
    "Recommend a batten spacing of 30 or 40 centimetres from the board thickness.",
  inputs: [
    {
      description: "Board thickness in millimetres, between ten and sixty.",
      id: "boardThicknessMm",
      kind: "number",
      label: "Board thickness",
      maximum: 60,
      minimum: 10,
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Recommended batten spacing in centimetres.",
      id: "spacingCm",
      kind: "number",
      label: "Batten spacing",
      unit: "cm",
    },
  ],
  calculate: (input) => ({
    spacingCm: (input.boardThicknessMm as number) >= 19 ? 40 : 30,
  }),
});
export const runBattenSpacing = battenSpacingTool.execute;
export default battenSpacingTool;
