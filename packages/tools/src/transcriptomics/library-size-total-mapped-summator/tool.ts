import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, sum } from "../batch53-shared.js";

export type Input = Readonly<{ mappedCounts: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "mappedCounts", label: "Mapped counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  i.mappedCounts.forEach((v) => bounded(v, "counts", 0, 1e12));
  return {
    totalMappedCounts: sum(i.mappedCounts),
    features: i.mappedCounts.length,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { mappedCounts: [2, 3] },
  output: { result: { totalMappedCounts: 5, features: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/library-size-total-mapped-summator",
  title: "Library Size Total Mapped Reads Summator",
  description:
    "Sum supplied mapped-count entries; callers must prevent multi-assigned read double counting. No alignment or library-size normalization.",
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
