import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly mPlusZeroIntensity: number;
  readonly mPlusOneIntensity: number;
  readonly percentMPlusOnePerCarbon: number;
}>;
export type Output = Readonly<{
  readonly estimatedCarbonCount: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.mPlusZeroIntensity <= 0 ||
    input.mPlusOneIntensity < 0 ||
    input.percentMPlusOnePerCarbon <= 0
  )
    simpleError(
      "percentMPlusOnePerCarbon",
      "Positive reference abundance and per-carbon response required.",
    );
  return {
    estimatedCarbonCount:
      ((input.mPlusOneIntensity / input.mPlusZeroIntensity) * 100) /
      input.percentMPlusOnePerCarbon,
  };
};
export const exampleInput = {
  mPlusZeroIntensity: 100,
  mPlusOneIntensity: 22,
  percentMPlusOnePerCarbon: 1.1,
} satisfies Input;
export const exampleOutput = { estimatedCarbonCount: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/mplus1-carbon-estimate",
  title: "MPLUS1 Carbon Estimate",
  description:
    "Estimate carbon number from M+1 intensity using a caller-supplied per-carbon isotope contribution.",
  inputs: [
    {
      id: "mPlusZeroIntensity",
      kind: "number",
      label: "M plus zero intensity",
    },
    { id: "mPlusOneIntensity", kind: "number", label: "M plus one intensity" },
    {
      id: "percentMPlusOnePerCarbon",
      kind: "number",
      label: "Percent m plus one per carbon",
    },
  ],
  outputs: [
    {
      id: "estimatedCarbonCount",
      kind: "number",
      label: "Estimated carbon count",
    },
  ],
  calculate: (value) =>
    calculate({
      mPlusZeroIntensity: value.mPlusZeroIntensity as number,
      mPlusOneIntensity: value.mPlusOneIntensity as number,
      percentMPlusOnePerCarbon: value.percentMPlusOnePerCarbon as number,
    }),
});
export const run = tool.execute;
export default tool;
