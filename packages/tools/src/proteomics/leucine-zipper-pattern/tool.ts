import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { proteinSequence } from "../../core/protein.js";

export type Input = Readonly<{
  readonly sequence: string;
  readonly minimumLeucines: number;
}>;
export type Output = Readonly<{
  readonly bestRegister: number;
  readonly longestRun: number;
  readonly candidate: boolean;
}>;
export const calculate = (input: Input): Output => {
  const s = proteinSequence(input.sequence);
  if (input.minimumLeucines < 2)
    simpleError(
      "minimumLeucines",
      "At least two leucines per candidate run required.",
    );
  let bestRegister = 0,
    longestRun = 0;
  for (let offset = 0; offset < 7; offset++) {
    let run = 0;
    for (let i = offset; i < s.length; i += 7) {
      run = s[i] === "L" ? run + 1 : 0;
      if (run > longestRun) {
        longestRun = run;
        bestRegister = offset;
      }
    }
  }
  return {
    bestRegister,
    longestRun,
    candidate: longestRun >= input.minimumLeucines,
  };
};
export const exampleInput = {
  sequence: "LAAAAAALAAAAAAL",
  minimumLeucines: 3,
} satisfies Input;
export const exampleOutput = {
  bestRegister: 0,
  longestRun: 3,
  candidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/leucine-zipper-pattern",
  title: "Leucine Zipper Pattern",
  description: "Scan every seventh residue for leucine-zipper runs.",
  inputs: [
    { id: "sequence", label: "Sequence", kind: "string" },
    { id: "minimumLeucines", label: "Minimum leucines", kind: "number" },
  ],
  outputs: [
    { id: "bestRegister", label: "Best register", kind: "number" },
    { id: "longestRun", label: "Longest run", kind: "number" },
    { id: "candidate", label: "Candidate", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sequence: value.sequence as string,
      minimumLeucines: value.minimumLeucines as number,
    }),
});
export const run = tool.execute;
export default tool;
