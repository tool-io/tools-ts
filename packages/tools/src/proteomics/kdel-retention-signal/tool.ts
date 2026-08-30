import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly retentionMotif: string;
  readonly matched: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    retentionMotif = s.slice(-4);
  return { retentionMotif, matched: retentionMotif === "KDEL" };
};
export const exampleInput = { sequence: "AKDEL" } satisfies Input;
export const exampleOutput = {
  retentionMotif: "KDEL",
  matched: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/kdel-retention-signal",
  title: "KDEL Retention Signal",
  description: "Detect a C-terminal KDEL ER retention signal.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "retentionMotif", label: "Retention motif", kind: "string" },
    { id: "matched", label: "Matched", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
