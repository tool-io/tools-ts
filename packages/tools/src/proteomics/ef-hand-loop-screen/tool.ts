import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly loopSequence: string;
  readonly expectedLength: number;
  readonly minimumAcidicResidues: number;
}>;
export type Output = Readonly<{
  readonly loopLength: number;
  readonly acidicResidueCount: number;
  readonly candidate: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.loopSequence),
    acidicResidueCount = [...s].filter((v) => v === "D" || v === "E").length;
  return {
    loopLength: s.length,
    acidicResidueCount,
    candidate:
      s.length === input.expectedLength &&
      acidicResidueCount >= input.minimumAcidicResidues,
  };
};
export const exampleInput = {
  loopSequence: "DADAEGADAEGA",
  expectedLength: 12,
  minimumAcidicResidues: 4,
} satisfies Input;
export const exampleOutput = {
  loopLength: 12,
  acidicResidueCount: 5,
  candidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/ef-hand-loop-screen",
  title: "Ef Hand Loop Screen",
  description:
    "Screen predicted EF-hand loops by length and acidic-residue count.",
  inputs: [
    { id: "loopSequence", label: "Loop sequence", kind: "string" },
    { id: "expectedLength", label: "Expected length", kind: "number" },
    {
      id: "minimumAcidicResidues",
      label: "Minimum acidic residues",
      kind: "number",
    },
  ],
  outputs: [
    { id: "loopLength", label: "Loop length", kind: "number" },
    { id: "acidicResidueCount", label: "Acidic residue count", kind: "number" },
    { id: "candidate", label: "Candidate", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      loopSequence: value.loopSequence as string,
      expectedLength: value.expectedLength as number,
      minimumAcidicResidues: value.minimumAcidicResidues as number,
    }),
});
export const run = tool.execute;
export default tool;
