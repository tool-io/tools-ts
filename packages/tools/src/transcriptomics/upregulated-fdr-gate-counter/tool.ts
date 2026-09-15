import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction, aligned } from "../batch53-shared.js";

export type Input = Readonly<{
  log2FoldChanges: readonly number[];
  adjustedPValues: readonly number[];
  maximumFdr: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "log2FoldChanges", label: "Log2 fold changes", kind: "numberList" },
  { id: "adjustedPValues", label: "Adjusted p values", kind: "numberList" },
  { id: "maximumFdr", label: "Maximum fdr", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  aligned(i.log2FoldChanges, i.adjustedPValues, "genes");
  fraction(i.maximumFdr, "fdr");
  i.adjustedPValues.forEach((v) => fraction(v, "adjusted-p"));
  const indexes = i.log2FoldChanges.flatMap((v, j) =>
    1 * v > 0 && i.adjustedPValues[j] <= i.maximumFdr ? [j] : [],
  );
  return { selectedCount: indexes.length, selectedIndexes: indexes };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    log2FoldChanges: [1, 0, -1],
    adjustedPValues: [0.01, 0.01, 0.01],
    maximumFdr: 0.05,
  },
  output: { result: { selectedCount: 1, selectedIndexes: [0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/upregulated-fdr-gate-counter",
  title: "Upregulated Gene Count Tally at FDR Gate Counter",
  description:
    "Count direction-specific genes at a supplied adjusted-p gate; zero effect is neither up nor down. Does not calculate FDR or establish biological relevance.",
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
