import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  quantile,
} from "../batch53-shared.js";

export type Input = Readonly<{ qualityScores: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "qualityScores", label: "Quality scores", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.qualityScores.length)
    simpleError("quality", "Observed per-base quality sample.");
  i.qualityScores.forEach((v) => nonnegative(v, "quality"));
  const a = [...i.qualityScores].sort((a, b) => a - b);
  return {
    minimum: a[0],
    q1: quantile(a, 0.25),
    median: quantile(a, 0.5),
    q3: quantile(a, 0.75),
    maximum: a.at(-1),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { qualityScores: [10, 20, 30, 40, 50] },
  output: { result: { minimum: 10, q1: 20, median: 30, q3: 40, maximum: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genomics/perbase-quality-summary-note-generator",
  title: "Per-Base Sequence Quality Box Stats Summary Note Generator",
  description:
    "Summarize supplied per-base Phred scores with type-7 interpolated quartiles; no FASTQ reader or sequencing-run quality verdict.",
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
