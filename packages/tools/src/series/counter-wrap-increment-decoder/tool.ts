import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, mod } from "../batch53-shared.js";

export type Input = Readonly<{ counts: readonly number[]; modulus: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "counts", label: "Counts", kind: "numberList" },
  { id: "modulus", label: "Modulus", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  bounded(i.modulus, "modulus", 1, 1e12);
  i.counts.forEach((v) => bounded(v, "count", 0, i.modulus - 1));
  return {
    increments: i.counts
      .slice(1)
      .map((v, j) => mod(v - i.counts[j], i.modulus)),
    assumption: "at-most-one-wrap-and-no-reset-between-samples",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { counts: [8, 1, 3], modulus: 10 },
  output: {
    result: {
      increments: [3, 2],
      assumption: "at-most-one-wrap-and-no-reset-between-samples",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/counter-wrap-increment-decoder",
  title: "Counter Wrap Increment Decoder",
  description:
    "Decode modular sampled counter increments under explicit at-most-one-wrap/no-reset assumptions; hidden multiple wraps are not recoverable.",
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
