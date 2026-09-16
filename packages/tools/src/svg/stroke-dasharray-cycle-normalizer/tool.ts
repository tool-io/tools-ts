import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch53-shared.js";

export type Input = Readonly<{ dashArray: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "dashArray", label: "Dash array", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!i.dashArray.length) simpleError("dash", "Explicit nonempty dash list.");
  i.dashArray.forEach((v) => nonnegative(v, "dash"));
  const normalized =
      i.dashArray.length % 2
        ? [...i.dashArray, ...i.dashArray]
        : [...i.dashArray],
    cycleLength = sum(normalized);
  return { normalized, cycleLength, solidBecauseAllZero: cycleLength === 0 };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { dashArray: [2, 1, 3] },
  output: {
    result: {
      normalized: [2, 1, 3, 2, 1, 3],
      cycleLength: 12,
      solidBecauseAllZero: false,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "svg/stroke-dasharray-cycle-normalizer",
  title: "SVG Stroke Dasharray Cycle Normalizer",
  description:
    "Normalize an odd SVG dash list by duplication and retain an all-zero solid-stroke condition; not an automatic dash renderer.",
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
