import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  timeSamples,
} from "../batch53-shared.js";

export type Input = Readonly<{ times: readonly number[]; maximumGap: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "times", label: "Times", kind: "numberList" },
  { id: "maximumGap", label: "Maximum gap", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  nonnegative(i.maximumGap, "maximum");
  timeSamples(i.times, i.times);
  return {
    gaps: i.times.slice(1).map((v, j) => ({
      afterIndex: j,
      duration: v - i.times[j],
      exceedsBudget: v - i.times[j] > i.maximumGap,
    })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { times: [0, 1, 4], maximumGap: 2 },
  output: {
    result: {
      gaps: [
        { afterIndex: 0, duration: 1, exceedsBudget: false },
        { afterIndex: 1, duration: 3, exceedsBudget: true },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/timestamp-gap-budget-audit",
  title: "Timestamp Gap Budget Audit",
  description:
    "Audit strictly increasing timestamp gaps against an inclusive caller maximum; no automatic missing-sample imputation.",
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
