import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  entry,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly earnedUnbilledMinor: number;
  readonly previouslyAccruedForSamePerformanceMinor: number;
}>;
export type Output = Readonly<{
  readonly postingAccounts: readonly string[];
  readonly postingDebitsMinor: readonly number[];
  readonly postingCreditsMinor: readonly number[];
}>;
const inputFields = [
  { id: "earnedUnbilledMinor", label: "Earned unbilled minor", kind: "number" },
  {
    id: "previouslyAccruedForSamePerformanceMinor",
    label: "Previously accrued for same performance minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.earnedUnbilledMinor, "earnedUnbilledMinor");
  money(
    input.previouslyAccruedForSamePerformanceMinor,
    "previouslyAccruedForSamePerformanceMinor",
  );
  const delta = integer(
    input.earnedUnbilledMinor - input.previouslyAccruedForSamePerformanceMinor,
    "trueUp",
  );
  return entry(["UnbilledReceivable", "Revenue"], [delta, -delta]);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  earnedUnbilledMinor: 100,
  previouslyAccruedForSamePerformanceMinor: 30,
} satisfies Input;
export const exampleOutput = {
  postingAccounts: ["UnbilledReceivable", "Revenue"],
  postingDebitsMinor: [70, 0],
  postingCreditsMinor: [0, 70],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/unbilled-receivables-accrued-revenue-entry",
  title: "Unbilled Receivables Accrued Revenue Entry Tool",
  description:
    "Build incremental unbilled-receivable/revenue true-up against already accrued same performance, retaining reversal if prior accrual exceeds revised caller earned amount; recognition support remains caller responsibility.",
  inputs: inputFields,
  outputs: [
    { id: "postingAccounts", label: "Posting accounts", kind: "stringList" },
    {
      id: "postingDebitsMinor",
      label: "Posting debits minor",
      kind: "numberList",
    },
    {
      id: "postingCreditsMinor",
      label: "Posting credits minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      earnedUnbilledMinor: value.earnedUnbilledMinor as number,
      previouslyAccruedForSamePerformanceMinor:
        value.previouslyAccruedForSamePerformanceMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
