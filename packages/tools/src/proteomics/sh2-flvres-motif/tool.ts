import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
}>;
export type Output = Readonly<{
  readonly motifStart: number;
  readonly present: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence),
    motifStart = s.indexOf("FLVRES");
  return { motifStart, present: motifStart >= 0 };
};
export const exampleInput = { sequence: "AFLVRESAA" } satisfies Input;
export const exampleOutput = { motifStart: 1, present: true } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/sh2-flvres-motif",
  title: "SH2 Flvres Motif",
  description:
    "Check an SH2-domain sequence for a FLVRES-like phosphotyrosine-binding motif.",
  inputs: [{ id: "sequence", label: "Sequence", kind: "string" }],
  outputs: [
    { id: "motifStart", label: "Motif start", kind: "number" },
    { id: "present", label: "Present", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
    }),
});
export const run = tool.execute;
export default tool;
