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
  return { residueCount: s.length };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { sequence: "ACDE" },
  output: { result: { residueCount: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/protein-sequence-residue-count-calculator",
  title: "Protein Sequence Residue Count Length Calculator",
  description:
    "Count validated canonical amino-acid residues, not FASTA headers, terminators or ambiguous residue assignments.",
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
