import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly conjugatedBilirubin: number;
  readonly totalBilirubin: number;
  readonly minimumDirectPercent: number;
}>;
export type Output = Readonly<{
  readonly directPercent: number;
  readonly indirectBilirubin: number;
  readonly directPredominant: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.totalBilirubin <= 0 ||
    input.conjugatedBilirubin < 0 ||
    input.conjugatedBilirubin > input.totalBilirubin
  )
    simpleError(
      "conjugatedBilirubin",
      "Conjugated bilirubin cannot exceed positive total.",
    );
  const directPercent =
    (input.conjugatedBilirubin / input.totalBilirubin) * 100;
  return {
    directPercent,
    indirectBilirubin: input.totalBilirubin - input.conjugatedBilirubin,
    directPredominant: directPercent >= input.minimumDirectPercent,
  };
};
export const exampleInput = {
  conjugatedBilirubin: 1,
  totalBilirubin: 4,
  minimumDirectPercent: 20,
} satisfies Input;
export const exampleOutput = {
  directPercent: 25,
  indirectBilirubin: 3,
  directPredominant: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/bilirubin-fraction",
  title: "Bilirubin Fraction",
  description:
    "Split bilirubin into direct and indirect fractions against a supplied threshold.",
  inputs: [
    {
      id: "conjugatedBilirubin",
      kind: "number",
      label: "Conjugated bilirubin",
    },
    { id: "totalBilirubin", kind: "number", label: "Total bilirubin" },
    {
      id: "minimumDirectPercent",
      kind: "number",
      label: "Minimum direct percent",
    },
  ],
  outputs: [
    { id: "directPercent", kind: "number", label: "Direct percent" },
    { id: "indirectBilirubin", kind: "number", label: "Indirect bilirubin" },
    { id: "directPredominant", kind: "boolean", label: "Direct predominant" },
  ],
  calculate: (value) =>
    calculate({
      conjugatedBilirubin: value.conjugatedBilirubin as number,
      totalBilirubin: value.totalBilirubin as number,
      minimumDirectPercent: value.minimumDirectPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
