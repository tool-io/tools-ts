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
  bounded,
  aligned,
  signedSum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly openingAccountBalancesMinor: readonly number[];
  readonly adjustmentAccountIndices: readonly number[];
  readonly signedDebitAdjustmentsMinor: readonly number[];
}>;
export type Output = Readonly<{
  readonly adjustedAccountBalancesMinor: readonly number[];
  readonly signedAdjustmentTotalMinor: number;
  readonly signedAdjustedTrialDifferenceMinor: number;
  readonly adjustmentsBalanced: boolean;
}>;
const inputFields = [
  {
    id: "openingAccountBalancesMinor",
    label: "Opening account balances minor",
    kind: "numberList",
  },
  {
    id: "adjustmentAccountIndices",
    label: "Adjustment account indices",
    kind: "numberList",
  },
  {
    id: "signedDebitAdjustmentsMinor",
    label: "Signed debit adjustments minor",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.openingAccountBalancesMinor.forEach((v) =>
    integer(v, "openingAccountBalancesMinor"),
  );
  input.signedDebitAdjustmentsMinor.forEach((v) =>
    integer(v, "signedDebitAdjustmentsMinor"),
  );
  aligned(
    input.adjustmentAccountIndices,
    input.signedDebitAdjustmentsMinor,
    "adjustmentAccountIndices",
  );
  if (!input.openingAccountBalancesMinor.length)
    simpleError("accounts", "Nonempty opening account ledger required.");
  const balances = [...input.openingAccountBalancesMinor];
  input.adjustmentAccountIndices.forEach((v, i) => {
    bounded(v, "accountIndex", 0, balances.length - 1);
    balances[v] = integer(
      balances[v] + input.signedDebitAdjustmentsMinor[i],
      "balance",
    );
  });
  const total = signedSum(input.signedDebitAdjustmentsMinor);
  return {
    adjustedAccountBalancesMinor: balances,
    signedAdjustmentTotalMinor: total,
    signedAdjustedTrialDifferenceMinor: signedSum(balances),
    adjustmentsBalanced: total === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  openingAccountBalancesMinor: [1000, -1000],
  adjustmentAccountIndices: [0, 1],
  signedDebitAdjustmentsMinor: [200, -200],
} satisfies Input;
export const exampleOutput = {
  adjustedAccountBalancesMinor: [1200, -1200],
  signedAdjustmentTotalMinor: 0,
  signedAdjustedTrialDifferenceMinor: 0,
  adjustmentsBalanced: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/adjusted-trial-balance-adjustments-total",
  title: "Adjusted Trial Balance Adjustments Total Tool",
  description:
    "Apply observed signed adjustment rows to explicit ledger indices, retaining both unbalanced adjustment and closing-trial evidence rather than silently forcing a balancing account.",
  inputs: inputFields,
  outputs: [
    {
      id: "adjustedAccountBalancesMinor",
      label: "Adjusted account balances minor",
      kind: "numberList",
    },
    {
      id: "signedAdjustmentTotalMinor",
      label: "Signed adjustment total minor",
      kind: "number",
    },
    {
      id: "signedAdjustedTrialDifferenceMinor",
      label: "Signed adjusted trial difference minor",
      kind: "number",
    },
    {
      id: "adjustmentsBalanced",
      label: "Adjustments balanced",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      openingAccountBalancesMinor:
        value.openingAccountBalancesMinor as readonly number[],
      adjustmentAccountIndices:
        value.adjustmentAccountIndices as readonly number[],
      signedDebitAdjustmentsMinor:
        value.signedDebitAdjustmentsMinor as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
