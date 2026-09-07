import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly callerPurposeProblemSolutionAskSeconds: readonly number[];
  readonly callerTotalBudgetSeconds: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerPurposeProblemSolutionAskSeconds",
    label: "Caller purpose problem solution ask seconds",
    kind: "numberList",
  },
  {
    id: "callerTotalBudgetSeconds",
    label: "Caller total budget seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerTotalBudgetSeconds, "callerTotalBudgetSeconds");
  input.callerPurposeProblemSolutionAskSeconds.forEach((v) =>
    nonnegative(v, "callerPurposeProblemSolutionAskSeconds"),
  );
  if (input.callerPurposeProblemSolutionAskSeconds.length !== 4)
    simpleError("stages", "Exactly four explicit stage duration budgets.");
  return {
    plannedTotalSeconds: sum(input.callerPurposeProblemSolutionAskSeconds),
    signedBudgetMarginSeconds:
      input.callerTotalBudgetSeconds -
      sum(input.callerPurposeProblemSolutionAskSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerPurposeProblemSolutionAskSeconds: [5, 10, 10, 5],
    callerTotalBudgetSeconds: 30,
  },
  output: { result: { plannedTotalSeconds: 30, signedBudgetMarginSeconds: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/elevator-pitch-30-second-structure-template",
  title: "Elevator Pitch 30-Second Structure Template",
  description:
    "Budget an explicit independently reviewed purpose/problem/solution/ask pitch structure;30seconds is a caller constraint, not universal format or speech duration from words.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
