import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence, trypsinCutPositions } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly maximumMissedCleavages: number;
}>;
export type Output = Readonly<{
  readonly basePeptides: number;
  readonly candidatePeptides: number;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (
    !Number.isSafeInteger(input.maximumMissedCleavages) ||
    input.maximumMissedCleavages < 0
  )
    simpleError(
      "maximumMissedCleavages",
      "Missed-cleavage limit must be a nonnegative integer.",
    );
  const basePeptides = trypsinCutPositions(s).length + 1;
  let candidatePeptides = 0;
  for (
    let missed = 0;
    missed <= Math.min(input.maximumMissedCleavages, basePeptides - 1);
    missed++
  )
    candidatePeptides += basePeptides - missed;
  return { basePeptides, candidatePeptides };
};
export const exampleInput = {
  sequence: "AKRA",
  maximumMissedCleavages: 1,
} satisfies Input;
export const exampleOutput = {
  basePeptides: 3,
  candidatePeptides: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/missed-cleavage-peptide-count",
  title: "Missed Cleavage Peptide Count",
  description:
    "Count fully and partially tryptic peptide candidates up to missed-cleavage limit.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    {
      id: "maximumMissedCleavages",
      label: "Maximum missed cleavages",
      kind: "number",
    },
  ],
  outputs: [
    { id: "basePeptides", label: "Base peptides", kind: "number" },
    { id: "candidatePeptides", label: "Candidate peptides", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      maximumMissedCleavages: value.maximumMissedCleavages as number,
    }),
});
export const run = tool.execute;
export default tool;
