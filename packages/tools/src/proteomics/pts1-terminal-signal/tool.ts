import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly allowedTerminalMotifs: readonly string[];
}>;
export type Output = Readonly<{
  readonly terminalTrimer: string;
  readonly matched: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    terminalTrimer = s.slice(-3);
  return {
    terminalTrimer,
    matched: input.allowedTerminalMotifs.includes(terminalTrimer),
  };
};
export const exampleInput = {
  sequence: "ASKL",
  allowedTerminalMotifs: ["SKL", "AKL"],
} satisfies Input;
export const exampleOutput = {
  terminalTrimer: "SKL",
  matched: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/pts1-terminal-signal",
  title: "PTS1 Terminal Signal",
  description:
    "Check a peroxisomal PTS1 terminus against caller-accepted tripeptides.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "allowedTerminalMotifs",
      label: "Allowed terminal motifs",
      kind: "stringList",
    },
  ],
  outputs: [
    { id: "terminalTrimer", label: "Terminal trimer", kind: "string" },
    { id: "matched", label: "Matched", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      allowedTerminalMotifs: value.allowedTerminalMotifs as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
