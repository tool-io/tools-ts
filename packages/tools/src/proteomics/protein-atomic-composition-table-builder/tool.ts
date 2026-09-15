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
  const s = proteinSequence(i.sequence),
    table: Record<string, number[]> = {
      A: [3, 5, 1, 1, 0],
      R: [6, 12, 4, 1, 0],
      N: [4, 6, 2, 2, 0],
      D: [4, 5, 1, 3, 0],
      C: [3, 5, 1, 1, 1],
      E: [5, 7, 1, 3, 0],
      Q: [5, 8, 2, 2, 0],
      G: [2, 3, 1, 1, 0],
      H: [6, 7, 3, 1, 0],
      I: [6, 11, 1, 1, 0],
      L: [6, 11, 1, 1, 0],
      K: [6, 12, 2, 1, 0],
      M: [5, 9, 1, 1, 1],
      F: [9, 9, 1, 1, 0],
      P: [5, 7, 1, 1, 0],
      S: [3, 5, 1, 2, 0],
      T: [4, 7, 1, 2, 0],
      W: [11, 10, 2, 1, 0],
      Y: [9, 9, 1, 2, 0],
      V: [5, 9, 1, 1, 0],
    },
    counts = [0, 2, 0, 1, 0];
  for (const c of s) table[c].forEach((v, j) => (counts[j] += v));
  return {
    elements: ["C", "H", "N", "O", "S"],
    counts,
    assumption: "linear-unmodified-neutral-chain-with-terminal-water",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { sequence: "AG" },
  output: {
    result: {
      elements: ["C", "H", "N", "O", "S"],
      counts: [5, 10, 2, 3, 0],
      assumption: "linear-unmodified-neutral-chain-with-terminal-water",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-atomic-composition-table-builder",
  title: "Protein Atomic Composition C-H-N-O-S Count Table Builder",
  description:
    "Sum polymer residue CHNOS compositions plus terminal H2O for a linear unmodified neutral protein chain; excludes disulfides, modifications and adducts.",
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
