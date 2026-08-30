import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly smiles: string;
}>;
export type Output = Readonly<{
  readonly delimitersBalanced: boolean;
  readonly branchCount: number;
  readonly bracketCount: number;
}>;
export const calculate = (input: Input): Output => {
  const stack: string[] = [],
    pairs: Record<string, string> = { ")": "(", "]": "[" };
  let branchCount = 0,
    bracketCount = 0;
  for (const c of input.smiles) {
    if (c === "(" || c === "[") {
      stack.push(c);
      if (c === "(") branchCount++;
      else bracketCount++;
    } else if (c === ")" || c === "]") {
      if (stack.pop() !== pairs[c])
        return { delimitersBalanced: false, branchCount, bracketCount };
    }
  }
  return { delimitersBalanced: stack.length === 0, branchCount, bracketCount };
};
export const exampleInput = { smiles: "C(=O)N[C@H](C)O" } satisfies Input;
export const exampleOutput = {
  delimitersBalanced: true,
  branchCount: 2,
  bracketCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/smiles-delimiter-validator",
  title: "SMILES Delimiter Validator",
  description:
    "Check SMILES branch and atom-bracket balance; does not verify chemical valence.",
  inputs: [{ id: "smiles", kind: "string", label: "Smiles" }],
  outputs: [
    { id: "delimitersBalanced", kind: "boolean", label: "Delimiters balanced" },
    { id: "branchCount", kind: "number", label: "Branch count" },
    { id: "bracketCount", kind: "number", label: "Bracket count" },
  ],
  calculate: (value) =>
    calculate({
      smiles: value.smiles as string,
    }),
});
export const run = tool.execute;
export default tool;
