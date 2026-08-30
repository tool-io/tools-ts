import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { count, dna } from "../shared.js";

export type Input = Readonly<{
  readonly primer: string;
  readonly bindingSequence: string;
  readonly terminalBases: number;
  readonly maximumMismatches: number;
}>;
export type Output = Readonly<{
  readonly mismatchIndexes: readonly number[];
  readonly terminalMismatchCount: number;
  readonly flagged: boolean;
}>;
export const calculate = (input: Input): Output => {
  const primer = dna(input.primer, "primer"),
    binding = dna(input.bindingSequence, "bindingSequence");
  count(input.terminalBases, "terminalBases", 1);
  count(input.maximumMismatches, "maximumMismatches");
  if (primer.length !== binding.length || input.terminalBases > primer.length)
    simpleError(
      "bindingSequence",
      "Equal-length primer-oriented sequences and a valid terminal window required.",
    );
  const mismatchIndexes = [...primer].flatMap((v, i) =>
      v === binding[i] ? [] : [i],
    ),
    terminalMismatchCount = mismatchIndexes.filter(
      (i) => i >= primer.length - input.terminalBases,
    ).length;
  return {
    mismatchIndexes,
    terminalMismatchCount,
    flagged:
      terminalMismatchCount > 0 ||
      mismatchIndexes.length > input.maximumMismatches,
  };
};
export const exampleInput = {
  primer: "ACGTACGT",
  bindingSequence: "ACGTACGA",
  terminalBases: 3,
  maximumMismatches: 2,
} satisfies Input;
export const exampleOutput = {
  mismatchIndexes: [7],
  terminalMismatchCount: 1,
  flagged: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/primer-terminal-mismatch-screen",
  title: "Primer Terminal Mismatch Screen",
  description:
    "Locate primer mismatches, emphasizing the 3-prime terminal window; binding sequence must already be oriented like the primer.",
  inputs: [
    { id: "primer", label: "Primer", kind: "string" },
    {
      id: "bindingSequence",
      label: "Binding sequence",
      kind: "string",
      description:
        "Aligned same-orientation sequence; reverse-complement a genomic binding strand before calling this tool when appropriate.",
    },
    {
      id: "terminalBases",
      label: "Terminal bases",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "maximumMismatches",
      label: "Maximum mismatches",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "mismatchIndexes", label: "Mismatch indexes", kind: "numberList" },
    {
      id: "terminalMismatchCount",
      label: "Terminal mismatch count",
      kind: "number",
    },
    { id: "flagged", label: "Flagged", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      primer: value.primer as string,
      bindingSequence: value.bindingSequence as string,
      terminalBases: value.terminalBases as number,
      maximumMismatches: value.maximumMismatches as number,
    }),
});
export const run = tool.execute;
export default tool;
