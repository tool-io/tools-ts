import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, range } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly leaderLengthMm: number;
  readonly callerMinimum: number;
  readonly callerMaximum: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "leaderLengthMm", label: "Leader length mm", kind: "number" },
  { id: "callerMinimum", label: "Caller minimum", kind: "number" },
  { id: "callerMaximum", label: "Caller maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  range([i.callerMinimum, i.callerMaximum], "bounds");
  return {
    withinCallerBounds:
      i.leaderLengthMm >= i.callerMinimum &&
      i.leaderLengthMm <= i.callerMaximum,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { leaderLengthMm: 40, callerMinimum: 0, callerMaximum: 30 },
  output: { result: { withinCallerBounds: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/leader-line-max-length-checker",
  title: "Leader Line Maximum Length Rule Checker",
  description:
    "Caller specification screen for leaderLengthMm only; not universal legibility, ADA compliance, print readiness or accessibility certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
