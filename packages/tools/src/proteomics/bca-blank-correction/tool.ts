import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sampleAbsorbance: number;
  readonly blankAbsorbance: number;
}>;
export type Output = Readonly<{
  readonly correctedAbsorbance: number;
  readonly aboveBlank: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (input.sampleAbsorbance < 0 || input.blankAbsorbance < 0)
    simpleError("sampleAbsorbance", "Absorbance values must be nonnegative.");
  const correctedAbsorbance = input.sampleAbsorbance - input.blankAbsorbance;
  return { correctedAbsorbance, aboveBlank: correctedAbsorbance > 0 };
};
export const exampleInput = {
  sampleAbsorbance: 0.8,
  blankAbsorbance: 0.2,
} satisfies Input;
export const exampleOutput = {
  correctedAbsorbance: 0.6000000000000001,
  aboveBlank: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/bca-blank-correction",
  title: "BCA Blank Correction",
  description: "Subtract the matched assay blank from BCA absorbance.",
  inputs: [
    { id: "sampleAbsorbance", label: "Sample absorbance", kind: "number" },
    { id: "blankAbsorbance", label: "Blank absorbance", kind: "number" },
  ],
  outputs: [
    {
      id: "correctedAbsorbance",
      label: "Corrected absorbance",
      kind: "number",
    },
    { id: "aboveBlank", label: "Above blank", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sampleAbsorbance: value.sampleAbsorbance as number,
      blankAbsorbance: value.blankAbsorbance as number,
    }),
});
export const run = tool.execute;
export default tool;
