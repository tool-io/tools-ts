import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { peptideNeutralMass } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly neutralMassDa: number;
}>;
export const calculate = (input: Input): Output => {
  return { neutralMassDa: peptideNeutralMass(input.sequence) };
};
export const exampleInput = { sequence: "A" } satisfies Input;
export const exampleOutput = { neutralMassDa: 89.04767 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/peptide-neutral-mass",
  title: "Peptide Neutral Mass",
  description:
    "Calculate monoisotopic neutral peptide mass from its canonical sequence.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [{ id: "neutralMassDa", label: "Neutral mass da", kind: "number" }],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
