import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair, runs } from "../batch53-shared.js";

export type Input = Readonly<{
  values: readonly number[];
  lowerLimit: number;
  upperLimit: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "Values", kind: "numberList" },
  { id: "lowerLimit", label: "Lower limit", kind: "number" },
  { id: "upperLimit", label: "Upper limit", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  orderedPair(i.lowerLimit, i.upperLimit, true);
  return {
    spans: runs(
      i.values.map((v) =>
        v <= i.lowerLimit ? "lower" : v >= i.upperLimit ? "upper" : "inside",
      ),
    )
      .filter((r) => r.value !== "inside")
      .map((r) => ({ start: r.start, end: r.end, side: r.value })),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { values: [-1, -1, 0, 2, 2], lowerLimit: -1, upperLimit: 2 },
  output: {
    result: {
      spans: [
        { start: 0, end: 2, side: "lower" },
        { start: 3, end: 5, side: "upper" },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "series/sample-saturation-span-finder",
  title: "Sample Saturation Span Finder",
  description:
    "Find sampled spans at or beyond explicit saturation limits, preserving lower versus upper sides; no hardware-clipping diagnosis.",
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
