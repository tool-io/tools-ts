import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, proteinSequence } from "../batch53-shared.js";

export type Input = Readonly<{ sequence: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sequence", label: "Sequence", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const s = proteinSequence(i.sequence);
  let longest = 0,
    current = 0;
  const starts: number[] = [];
  for (let j = 0; j < s.length; j++) {
    current = s[j] === "A" ? current + 1 : 0;
    if (current > longest) {
      longest = current;
      starts.length = 0;
      starts.push(j - current + 1);
    } else if (current === longest && current > 0) starts.push(j - current + 1);
  }
  return { longestRun: longest, tiedStartOffsets: starts };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { sequence: "AAAGAAA" },
  output: { result: { longestRun: 3, tiedStartOffsets: [0, 4] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/polyalanine-run-length-finder",
  title: "Polyalanine Consecutive A Run Length Finder",
  description:
    "Find the longest consecutive A run with tied zero-based start offsets in canonical protein sequence; no disease threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
