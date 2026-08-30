import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly journalLineDebitsMinor: readonly number[];
  readonly journalLineCreditsMinor: readonly number[];
  readonly callerToleranceMinor: number;
}>;
export type Output = Readonly<{
  readonly journalTotalDebitsMinor: number;
  readonly journalTotalCreditsMinor: number;
  readonly signedJournalDifferenceMinor: number;
  readonly doubleSidedLineIndices: readonly number[];
  readonly balancedAndSingleSidedWithinTolerance: boolean;
}>;
const inputFields = [
  {
    id: "journalLineDebitsMinor",
    label: "Journal line debits minor",
    kind: "numberList",
  },
  {
    id: "journalLineCreditsMinor",
    label: "Journal line credits minor",
    kind: "numberList",
  },
  {
    id: "callerToleranceMinor",
    label: "Caller tolerance minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.journalLineDebitsMinor.forEach((v) =>
    money(v, "journalLineDebitsMinor"),
  );
  input.journalLineCreditsMinor.forEach((v) =>
    money(v, "journalLineCreditsMinor"),
  );
  money(input.callerToleranceMinor, "callerToleranceMinor");
  aligned(
    input.journalLineDebitsMinor,
    input.journalLineCreditsMinor,
    "journalLineDebitsMinor",
  );
  const d = sumMoney(input.journalLineDebitsMinor),
    c = sumMoney(input.journalLineCreditsMinor),
    both = input.journalLineDebitsMinor.flatMap((v, i) =>
      v > 0 && input.journalLineCreditsMinor[i] > 0 ? [i] : [],
    ),
    gap = integer(d - c, "difference");
  return {
    journalTotalDebitsMinor: d,
    journalTotalCreditsMinor: c,
    signedJournalDifferenceMinor: gap,
    doubleSidedLineIndices: both,
    balancedAndSingleSidedWithinTolerance:
      both.length === 0 && Math.abs(gap) <= input.callerToleranceMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  journalLineDebitsMinor: [100, 0],
  journalLineCreditsMinor: [0, 100],
  callerToleranceMinor: 0,
} satisfies Input;
export const exampleOutput = {
  journalTotalDebitsMinor: 100,
  journalTotalCreditsMinor: 100,
  signedJournalDifferenceMinor: 0,
  doubleSidedLineIndices: [],
  balancedAndSingleSidedWithinTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/compound-journal-entry-debits-credits-validator",
  title: "Compound Journal Entry Debits Credits Validator",
  description:
    "Validate actual compound-journal line debits/credits for aggregate balance and forbidden same-line debit+credit entries; repeated accounts and zero informational lines are permitted, account-level trial balance is a separate operation.",
  inputs: inputFields,
  outputs: [
    {
      id: "journalTotalDebitsMinor",
      label: "Journal total debits minor",
      kind: "number",
    },
    {
      id: "journalTotalCreditsMinor",
      label: "Journal total credits minor",
      kind: "number",
    },
    {
      id: "signedJournalDifferenceMinor",
      label: "Signed journal difference minor",
      kind: "number",
    },
    {
      id: "doubleSidedLineIndices",
      label: "Double sided line indices",
      kind: "numberList",
    },
    {
      id: "balancedAndSingleSidedWithinTolerance",
      label: "Balanced and single sided within tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      journalLineDebitsMinor: value.journalLineDebitsMinor as readonly number[],
      journalLineCreditsMinor:
        value.journalLineCreditsMinor as readonly number[],
      callerToleranceMinor: value.callerToleranceMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
