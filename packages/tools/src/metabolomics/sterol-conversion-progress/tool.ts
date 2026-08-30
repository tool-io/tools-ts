import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lanosterol: number;
  readonly cholesterol: number;
  readonly otherSterols: number;
}>;
export type Output = Readonly<{
  readonly conversionProxyPercent: number;
  readonly precursorSharePercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (Math.min(input.lanosterol, input.cholesterol, input.otherSterols) < 0)
    simpleError("lanosterol", "Sterol amounts must be nonnegative.");
  const total = input.lanosterol + input.cholesterol + input.otherSterols;
  if (total <= 0) simpleError("lanosterol", "Total sterols must be positive.");
  return {
    conversionProxyPercent: (input.cholesterol / total) * 100,
    precursorSharePercent: (input.lanosterol / total) * 100,
  };
};
export const exampleInput = {
  lanosterol: 20,
  cholesterol: 80,
  otherSterols: 0,
} satisfies Input;
export const exampleOutput = {
  conversionProxyPercent: 80,
  precursorSharePercent: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/sterol-conversion-progress",
  title: "Sterol Conversion Progress",
  description:
    "Summarize lanosterol and cholesterol fractions as a conversion proxy, not flux.",
  inputs: [
    { id: "lanosterol", kind: "number", label: "Lanosterol" },
    { id: "cholesterol", kind: "number", label: "Cholesterol" },
    { id: "otherSterols", kind: "number", label: "Other sterols" },
  ],
  outputs: [
    {
      id: "conversionProxyPercent",
      kind: "number",
      label: "Conversion proxy percent",
    },
    {
      id: "precursorSharePercent",
      kind: "number",
      label: "Precursor share percent",
    },
  ],
  calculate: (value) =>
    calculate({
      lanosterol: value.lanosterol as number,
      cholesterol: value.cholesterol as number,
      otherSterols: value.otherSterols as number,
    }),
});
export const run = tool.execute;
export default tool;
