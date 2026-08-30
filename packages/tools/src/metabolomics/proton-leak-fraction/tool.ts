import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly oligomycinOcr: number;
  readonly nonMitochondrialOcr: number;
  readonly basalOcr: number;
}>;
export type Output = Readonly<{
  readonly protonLeakOcr: number;
  readonly protonLeakPercent: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.basalOcr <= input.nonMitochondrialOcr ||
    input.oligomycinOcr < input.nonMitochondrialOcr ||
    input.oligomycinOcr > input.basalOcr
  )
    simpleError("basalOcr", "Basal OCR must exceed non-mitochondrial OCR.");
  const protonLeakOcr = input.oligomycinOcr - input.nonMitochondrialOcr;
  return {
    protonLeakOcr,
    protonLeakPercent:
      (protonLeakOcr / (input.basalOcr - input.nonMitochondrialOcr)) * 100,
  };
};
export const exampleInput = {
  oligomycinOcr: 30,
  nonMitochondrialOcr: 10,
  basalOcr: 110,
} satisfies Input;
export const exampleOutput = {
  protonLeakOcr: 20,
  protonLeakPercent: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/proton-leak-fraction",
  title: "Proton Leak Fraction",
  description:
    "Measure oligomycin-resistant proton leak after non-mitochondrial subtraction.",
  inputs: [
    { id: "oligomycinOcr", kind: "number", label: "Oligomycin ocr" },
    {
      id: "nonMitochondrialOcr",
      kind: "number",
      label: "Non mitochondrial ocr",
    },
    { id: "basalOcr", kind: "number", label: "Basal ocr" },
  ],
  outputs: [
    { id: "protonLeakOcr", kind: "number", label: "Proton leak ocr" },
    { id: "protonLeakPercent", kind: "number", label: "Proton leak percent" },
  ],
  calculate: (value) =>
    calculate({
      oligomycinOcr: value.oligomycinOcr as number,
      nonMitochondrialOcr: value.nonMitochondrialOcr as number,
      basalOcr: value.basalOcr as number,
    }),
});
export const run = tool.execute;
export default tool;
