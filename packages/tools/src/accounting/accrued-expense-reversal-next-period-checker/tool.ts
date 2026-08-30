import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  aligned,
  entry,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly originalAccrualAccountNames: readonly string[];
  readonly originalSignedDebitAmountsMinor: readonly number[];
  readonly callerReversalAuthorized: boolean;
}>;
export type Output = Readonly<{
  readonly postingAccounts: readonly string[];
  readonly postingDebitsMinor: readonly number[];
  readonly postingCreditsMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "originalAccrualAccountNames",
    label: "Original accrual account names",
    kind: "stringList",
  },
  {
    id: "originalSignedDebitAmountsMinor",
    label: "Original signed debit amounts minor",
    kind: "numberList",
  },
  {
    id: "callerReversalAuthorized",
    label: "Caller reversal authorized",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.originalSignedDebitAmountsMinor.forEach((v) =>
    integer(v, "originalSignedDebitAmountsMinor"),
  );
  aligned(
    input.originalAccrualAccountNames,
    input.originalSignedDebitAmountsMinor,
    "originalAccrualAccountNames",
  );
  if (!input.callerReversalAuthorized)
    simpleError(
      "authorization",
      "Explicit caller next-period reversal authorization required; no reversal inferred from account names.",
    );
  return entry(
    input.originalAccrualAccountNames,
    input.originalSignedDebitAmountsMinor.map((v) => -v),
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  originalAccrualAccountNames: ["Expense", "AccruedPayable"],
  originalSignedDebitAmountsMinor: [100, -100],
  callerReversalAuthorized: true,
} satisfies Input;
export const exampleOutput = {
  postingAccounts: ["Expense", "AccruedPayable"],
  postingDebitsMinor: [0, 100],
  postingCreditsMinor: [100, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/accrued-expense-reversal-next-period-checker",
  title: "Accrued Expense Reversal Next Period Checker",
  description:
    "Construct exact opposite next-period posting for a caller authorized balanced accrual journal; no automatic reversal of prepaids, cash transactions or already reversed entries.",
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
      originalAccrualAccountNames:
        value.originalAccrualAccountNames as readonly string[],
      originalSignedDebitAmountsMinor:
        value.originalSignedDebitAmountsMinor as readonly number[],
      callerReversalAuthorized: value.callerReversalAuthorized as boolean,
    }),
});
export const run = tool.execute;
export default tool;
