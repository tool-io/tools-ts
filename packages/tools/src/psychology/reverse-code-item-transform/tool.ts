import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerItemMinimum: number;
  readonly callerItemMaximum: number;
  readonly actualObservedItemScore: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "callerItemMinimum", label: "Caller item minimum", kind: "number" },
  { id: "callerItemMaximum", label: "Caller item maximum", kind: "number" },
  {
    id: "actualObservedItemScore",
    label: "Actual observed item score",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.callerItemMaximum <= input.callerItemMinimum ||
    input.actualObservedItemScore < input.callerItemMinimum ||
    input.actualObservedItemScore > input.callerItemMaximum
  )
    simpleError("item", "Observed code within actual ordered bounds.");
  return {
    value:
      input.callerItemMinimum +
      input.callerItemMaximum -
      input.actualObservedItemScore,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerItemMinimum: 1,
    callerItemMaximum: 5,
    actualObservedItemScore: 2,
  },
  output: { result: { value: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "psychology/reverse-code-item-transform",
  title: "Reverse-Code Item Transform Tool",
  description:
    "Explicit reverse item min+max\u2212observed score, on independently validated ordered bounds; not auto reverse from text. Actual independently qualified instrument/cohort/matching units; no diagnosis, causal outcome, validated personal prediction or universal clinical cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
