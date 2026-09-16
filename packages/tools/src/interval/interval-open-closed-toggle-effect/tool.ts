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
  toggleStart: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", label: "Start", kind: "number" },
  { id: "end", label: "End", kind: "number" },
  { id: "value", label: "Value", kind: "number" },
  { id: "startClosed", label: "Start closed", kind: "boolean" },
  { id: "endClosed", label: "End closed", kind: "boolean" },
  { id: "toggleStart", label: "Toggle start", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  orderedPair(i.start, i.end);
  const before =
      (i.value > i.start || (i.startClosed && i.value === i.start)) &&
      (i.value < i.end || (i.endClosed && i.value === i.end)),
    sc = i.toggleStart ? !i.startClosed : i.startClosed,
    ec = i.toggleStart ? i.endClosed : !i.endClosed,
    after =
      (i.value > i.start || (sc && i.value === i.start)) &&
      (i.value < i.end || (ec && i.value === i.end));
  return {
    includedBefore: before,
    includedAfter: after,
    membershipChanged: before !== after,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    start: 0,
    end: 1,
    value: 0,
    startClosed: false,
    endClosed: true,
    toggleStart: true,
  },
  output: {
    result: {
      includedBefore: false,
      includedAfter: true,
      membershipChanged: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "interval/interval-open-closed-toggle-effect",
  title: "Interval Endpoint Toggle Effect",
  description:
    "Audit membership effect of toggling one interval endpoint closure; degenerate intervals still require both endpoint conditions.",
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
