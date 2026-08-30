import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly terminalTrimer: string;
  readonly motifClass: string;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    terminalTrimer = s.slice(-3);
  return {
    terminalTrimer,
    motifClass: /^[ST].[VIL]$/.test(terminalTrimer)
      ? "class-I"
      : /^[VILF].[VIL]$/.test(terminalTrimer)
        ? "class-II"
        : "unmatched",
  };
};
export const exampleInput = { sequence: "ASAV" } satisfies Input;
export const exampleOutput = {
  terminalTrimer: "SAV",
  motifClass: "class-I",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/pdz-terminal-motif",
  title: "PDZ Terminal Motif",
  description:
    "Classify the terminal tripeptide of a candidate PDZ-binding ligand.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "terminalTrimer", label: "Terminal trimer", kind: "string" },
    { id: "motifClass", label: "Motif class", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
