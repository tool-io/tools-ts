import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedMassDa: number;
  readonly theoreticalMassDa: number;
}>;
export type Output = Readonly<{
  readonly signedErrorDa: number;
  readonly absoluteErrorDa: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.observedMassDa <= 0 || input.theoreticalMassDa <= 0)
    simpleError(
      "theoreticalMassDa",
      "Positive observed and theoretical peptide masses required.",
    );
  const signedErrorDa = input.observedMassDa - input.theoreticalMassDa;
  return { signedErrorDa, absoluteErrorDa: Math.abs(signedErrorDa) };
};
export const exampleInput = {
  observedMassDa: 501,
  theoreticalMassDa: 500,
} satisfies Input;
export const exampleOutput = {
  signedErrorDa: 1,
  absoluteErrorDa: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/peptide-mass-error-dalton",
  title: "Peptide Mass Error Dalton",
  description: "Calculate peptide mass error in daltons.",
  inputs: [
    { id: "observedMassDa", label: "Observed mass da", kind: "number" },
    { id: "theoreticalMassDa", label: "Theoretical mass da", kind: "number" },
  ],
  outputs: [
    { id: "signedErrorDa", label: "Signed error da", kind: "number" },
    { id: "absoluteErrorDa", label: "Absolute error da", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedMassDa: value.observedMassDa as number,
      theoreticalMassDa: value.theoreticalMassDa as number,
    }),
});
export const run = tool.execute;
export default tool;
