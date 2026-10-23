import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch53-shared.js";

export type Input = Readonly<{ counts: readonly number[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "counts", label: "Counts", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  i.counts.forEach((v) => bounded(v, "counts", 0, 1e12));
  return { plusOneCounts: i.counts.map((v) => v + 1) };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { counts: [0, 2] },
  output: { result: { plusOneCounts: [1, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "transcriptomics/pseudocount-plusone-applier",
  title: "Pseudocount Plus-One Zero-Avoidance Applier",
  description:
    "Apply an explicit plus-one pseudocount to nonnegative integer expression counts; not a fitted normalization model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          plusOneCounts: { type: "array", items: { type: "number" } },
        },
        required: ["plusOneCounts"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
