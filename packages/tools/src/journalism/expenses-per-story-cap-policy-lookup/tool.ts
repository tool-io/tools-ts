import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  unique,
  integer,
  money,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly storyIds: readonly string[];
  readonly incurredExpensesMinor: readonly number[];
  readonly preapprovedAmountsMinor: readonly number[];
  readonly callerUnapprovedExpenseCapMinor: number;
}>;
export type Output = Readonly<{
  readonly amountsAbovePreapprovalMinor: readonly number[];
  readonly signedPreapprovalMarginsMinor: readonly number[];
  readonly storyIndicesAboveCallerUnapprovedCap: readonly number[];
}>;
const inputFields = [
  { id: "storyIds", label: "Story ids", kind: "stringList" },
  {
    id: "incurredExpensesMinor",
    label: "Incurred expenses minor",
    kind: "numberList",
  },
  {
    id: "preapprovedAmountsMinor",
    label: "Preapproved amounts minor",
    kind: "numberList",
  },
  {
    id: "callerUnapprovedExpenseCapMinor",
    label: "Caller unapproved expense cap minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.storyIds, input.incurredExpensesMinor, "storyIds");
  aligned(input.storyIds, input.preapprovedAmountsMinor, "storyIds");
  unique(input.storyIds, "stories");
  [
    ...input.incurredExpensesMinor,
    ...input.preapprovedAmountsMinor,
    input.callerUnapprovedExpenseCapMinor,
  ].forEach((v) => money(v, "expense"));
  const excess = input.incurredExpensesMinor.map((v, i) =>
    Math.max(0, v - input.preapprovedAmountsMinor[i]),
  );
  return {
    amountsAbovePreapprovalMinor: excess,
    signedPreapprovalMarginsMinor: input.incurredExpensesMinor.map((v, i) =>
      integer(input.preapprovedAmountsMinor[i] - v, "margin"),
    ),
    storyIndicesAboveCallerUnapprovedCap: excess.flatMap((v, i) =>
      v > input.callerUnapprovedExpenseCapMinor ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  storyIds: ["a", "b"],
  incurredExpensesMinor: [100, 200],
  preapprovedAmountsMinor: [150, 150],
  callerUnapprovedExpenseCapMinor: 50,
} satisfies Input;
export const exampleOutput = {
  amountsAbovePreapprovalMinor: [0, 50],
  signedPreapprovalMarginsMinor: [50, -50],
  storyIndicesAboveCallerUnapprovedCap: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/expenses-per-story-cap-policy-lookup",
  title: "Expenses per Story Cap Policy Lookup",
  description:
    "Audit actual per-story expense/preapproval ledgers against caller unapproved overage cap, preserving signed budget margin; no automatic reimbursement entitlement, invented outlet cap or receipt authenticity assessment.",
  inputs: inputFields,
  outputs: [
    {
      id: "amountsAbovePreapprovalMinor",
      label: "Amounts above preapproval minor",
      kind: "numberList",
    },
    {
      id: "signedPreapprovalMarginsMinor",
      label: "Signed preapproval margins minor",
      kind: "numberList",
    },
    {
      id: "storyIndicesAboveCallerUnapprovedCap",
      label: "Story indices above caller unapproved cap",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      storyIds: value.storyIds as readonly string[],
      incurredExpensesMinor: value.incurredExpensesMinor as readonly number[],
      preapprovedAmountsMinor:
        value.preapprovedAmountsMinor as readonly number[],
      callerUnapprovedExpenseCapMinor:
        value.callerUnapprovedExpenseCapMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
