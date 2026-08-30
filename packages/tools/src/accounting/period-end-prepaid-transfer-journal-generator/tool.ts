import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  entry,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly prepaidOpeningBalanceMinor: number;
  readonly callerCurrentPeriodExpiredMinor: number;
  readonly alreadyTransferredThisPeriodMinor: number;
}>;
export type Output = Readonly<{
  readonly postingAccounts: readonly string[];
  readonly postingDebitsMinor: readonly number[];
  readonly postingCreditsMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "prepaidOpeningBalanceMinor",
    label: "Prepaid opening balance minor",
    kind: "number",
  },
  {
    id: "callerCurrentPeriodExpiredMinor",
    label: "Caller current period expired minor",
    kind: "number",
  },
  {
    id: "alreadyTransferredThisPeriodMinor",
    label: "Already transferred this period minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.prepaidOpeningBalanceMinor, "prepaidOpeningBalanceMinor");
  money(
    input.callerCurrentPeriodExpiredMinor,
    "callerCurrentPeriodExpiredMinor",
  );
  money(
    input.alreadyTransferredThisPeriodMinor,
    "alreadyTransferredThisPeriodMinor",
  );
  if (
    input.callerCurrentPeriodExpiredMinor > input.prepaidOpeningBalanceMinor ||
    input.alreadyTransferredThisPeriodMinor > input.prepaidOpeningBalanceMinor
  )
    simpleError(
      "prepaid",
      "Observed cumulative transfers/expiry cannot exceed opening prepaid in this model.",
    );
  const delta = integer(
    input.callerCurrentPeriodExpiredMinor -
      input.alreadyTransferredThisPeriodMinor,
    "transfer",
  );
  return entry(["PrepaidExpense", "PrepaidAsset"], [delta, -delta]);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  prepaidOpeningBalanceMinor: 100,
  callerCurrentPeriodExpiredMinor: 30,
  alreadyTransferredThisPeriodMinor: 10,
} satisfies Input;
export const exampleOutput = {
  postingAccounts: ["PrepaidExpense", "PrepaidAsset"],
  postingDebitsMinor: [20, 0],
  postingCreditsMinor: [0, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/period-end-prepaid-transfer-journal-generator",
  title: "Period End Prepaid Transfer Journal Generator",
  description:
    "Generate incremental current-period expiry transfer from caller prepaid schedule versus already posted transfer; excess previously posted transfer reverses rather than duplicating expense. No service recognition inferred.",
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
      prepaidOpeningBalanceMinor: value.prepaidOpeningBalanceMinor as number,
      callerCurrentPeriodExpiredMinor:
        value.callerCurrentPeriodExpiredMinor as number,
      alreadyTransferredThisPeriodMinor:
        value.alreadyTransferredThisPeriodMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
