import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, orderedPair } from "../batch53-shared.js";

export type Input = Readonly<{
  start: number;
  end: number;
  value: number;
  startClosed: boolean;
  endClosed: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
  { id: "value", label: "Value", kind: "number" },
  { id: "startClosed", label: "Start closed", kind: "boolean" },
  { id: "endClosed", label: "End closed", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  orderedPair(i.start, i.end);
  return {
    included:
      (i.value > i.start || (i.startClosed && i.value === i.start)) &&
      (i.value < i.end || (i.endClosed && i.value === i.end)),
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { start: 1, end: 3, value: 1, startClosed: false, endClosed: true },
  output: { result: { included: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-inclusion-flag",
  title: "Numeric Interval Inclusion Flag",
  description:
    "Check membership in a finite interval with independently specified open/closed endpoints, including degenerate intervals.",
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
