import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly bankStatementBalanceMinor: number;
  readonly depositsInTransitMinor: readonly number[];
  readonly outstandingChecksMinor: readonly number[];
  readonly bookCashBalanceMinor: number;
  readonly unrecordedBankCreditsMinor: readonly number[];
  readonly unrecordedBankDebitsMinor: readonly number[];
  readonly signedBookErrorCorrectionsMinor: readonly number[];
  readonly signedBankErrorCorrectionsMinor: readonly number[];
  readonly callerToleranceMinor: number;
}>;
export type Output = Readonly<{
  readonly adjustedBankCashMinor: number;
  readonly adjustedBookCashMinor: number;
  readonly signedUnreconciledBankMinusBookMinor: number;
  readonly reconciledWithinCallerTolerance: boolean;
}>;
const inputFields = [
  {
    id: "bankStatementBalanceMinor",
    label: "Bank statement balance minor",
    kind: "number",
  },
  {
    id: "depositsInTransitMinor",
    label: "Deposits in transit minor",
    kind: "numberList",
  },
  {
    id: "outstandingChecksMinor",
    label: "Outstanding checks minor",
    kind: "numberList",
  },
  {
    id: "bookCashBalanceMinor",
    label: "Book cash balance minor",
    kind: "number",
  },
  {
    id: "unrecordedBankCreditsMinor",
    label: "Unrecorded bank credits minor",
    kind: "numberList",
  },
  {
    id: "unrecordedBankDebitsMinor",
    label: "Unrecorded bank debits minor",
    kind: "numberList",
  },
  {
    id: "signedBookErrorCorrectionsMinor",
    label: "Signed book error corrections minor",
    kind: "numberList",
  },
  {
    id: "signedBankErrorCorrectionsMinor",
    label: "Signed bank error corrections minor",
    kind: "numberList",
  },
  {
    id: "callerToleranceMinor",
    label: "Caller tolerance minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.depositsInTransitMinor.forEach((v) =>
    money(v, "depositsInTransitMinor"),
  );
  input.outstandingChecksMinor.forEach((v) =>
    money(v, "outstandingChecksMinor"),
  );
  input.unrecordedBankCreditsMinor.forEach((v) =>
    money(v, "unrecordedBankCreditsMinor"),
  );
  input.unrecordedBankDebitsMinor.forEach((v) =>
    money(v, "unrecordedBankDebitsMinor"),
  );
  money(input.callerToleranceMinor, "callerToleranceMinor");
  integer(input.bankStatementBalanceMinor, "bankStatementBalanceMinor");
  integer(input.bookCashBalanceMinor, "bookCashBalanceMinor");
  input.signedBookErrorCorrectionsMinor.forEach((v) =>
    integer(v, "signedBookErrorCorrectionsMinor"),
  );
  input.signedBankErrorCorrectionsMinor.forEach((v) =>
    integer(v, "signedBankErrorCorrectionsMinor"),
  );
  const bank = signedSum([
      input.bankStatementBalanceMinor,
      sumMoney(input.depositsInTransitMinor),
      -sumMoney(input.outstandingChecksMinor),
      ...input.signedBankErrorCorrectionsMinor,
    ]),
    book = signedSum([
      input.bookCashBalanceMinor,
      sumMoney(input.unrecordedBankCreditsMinor),
      -sumMoney(input.unrecordedBankDebitsMinor),
      ...input.signedBookErrorCorrectionsMinor,
    ]),
    gap = integer(bank - book, "residual");
  return {
    adjustedBankCashMinor: bank,
    adjustedBookCashMinor: book,
    signedUnreconciledBankMinusBookMinor: gap,
    reconciledWithinCallerTolerance:
      Math.abs(gap) <= input.callerToleranceMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  bankStatementBalanceMinor: 1000,
  depositsInTransitMinor: [200],
  outstandingChecksMinor: [100],
  bookCashBalanceMinor: 1000,
  unrecordedBankCreditsMinor: [50],
  unrecordedBankDebitsMinor: [20],
  signedBookErrorCorrectionsMinor: [70],
  signedBankErrorCorrectionsMinor: [0],
  callerToleranceMinor: 0,
} satisfies Input;
export const exampleOutput = {
  adjustedBankCashMinor: 1100,
  adjustedBookCashMinor: 1100,
  signedUnreconciledBankMinusBookMinor: 0,
  reconciledWithinCallerTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/bank-reconciliation-outstanding-items-bridge",
  title: "Bank Reconciliation Outstanding Items Bridge Tool",
  description:
    "Bridge separate statement/book cash with actual transit/checks, unrecorded credits/debits and signed corrections; preserves unexplained difference rather than adding a plug. Equal totals do not establish item clearance or record completeness.",
  inputs: inputFields,
  outputs: [
    {
      id: "adjustedBankCashMinor",
      label: "Adjusted bank cash minor",
      kind: "number",
    },
    {
      id: "adjustedBookCashMinor",
      label: "Adjusted book cash minor",
      kind: "number",
    },
    {
      id: "signedUnreconciledBankMinusBookMinor",
      label: "Signed unreconciled bank minus book minor",
      kind: "number",
    },
    {
      id: "reconciledWithinCallerTolerance",
      label: "Reconciled within caller tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      bankStatementBalanceMinor: value.bankStatementBalanceMinor as number,
      depositsInTransitMinor: value.depositsInTransitMinor as readonly number[],
      outstandingChecksMinor: value.outstandingChecksMinor as readonly number[],
      bookCashBalanceMinor: value.bookCashBalanceMinor as number,
      unrecordedBankCreditsMinor:
        value.unrecordedBankCreditsMinor as readonly number[],
      unrecordedBankDebitsMinor:
        value.unrecordedBankDebitsMinor as readonly number[],
      signedBookErrorCorrectionsMinor:
        value.signedBookErrorCorrectionsMinor as readonly number[],
      signedBankErrorCorrectionsMinor:
        value.signedBankErrorCorrectionsMinor as readonly number[],
      callerToleranceMinor: value.callerToleranceMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
