import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly waterWindowIntegral: number;
  readonly referenceRegionIntegral: number;
  readonly maximumResidualPercent: number;
}>;
export type Output = Readonly<{
  readonly residualPercent: number;
  readonly passes: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.waterWindowIntegral < 0 || input.referenceRegionIntegral <= 0)
    simpleError(
      "referenceRegionIntegral",
      "Positive reference integral required.",
    );
  const residualPercent =
    (input.waterWindowIntegral / input.referenceRegionIntegral) * 100;
  return {
    residualPercent,
    passes: residualPercent <= input.maximumResidualPercent,
  };
};
export const exampleInput = {
  waterWindowIntegral: 5,
  referenceRegionIntegral: 100,
  maximumResidualPercent: 10,
} satisfies Input;
export const exampleOutput = {
  residualPercent: 5,
  passes: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/nmr-water-suppression",
  title: "NMR Water Suppression",
  description:
    "Screen NMR water-window residual intensity relative to a reference region.",
  inputs: [
    {
      id: "waterWindowIntegral",
      kind: "number",
      label: "Water window integral",
    },
    {
      id: "referenceRegionIntegral",
      kind: "number",
      label: "Reference region integral",
    },
    {
      id: "maximumResidualPercent",
      kind: "number",
      label: "Maximum residual percent",
    },
  ],
  outputs: [
    { id: "residualPercent", kind: "number", label: "Residual percent" },
    { id: "passes", kind: "boolean", label: "Passes" },
  ],
  calculate: (value) =>
    calculate({
      waterWindowIntegral: value.waterWindowIntegral as number,
      referenceRegionIntegral: value.referenceRegionIntegral as number,
      maximumResidualPercent: value.maximumResidualPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
