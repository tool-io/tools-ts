import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  entry,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly assetPeriodChargesMinor: readonly number[];
  readonly alreadyPostedDepreciationMinor: number;
}>;
export type Output = Readonly<{
  readonly postingAccounts: readonly string[];
  readonly postingDebitsMinor: readonly number[];
  readonly postingCreditsMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "assetPeriodChargesMinor",
    label: "Asset period charges minor",
    kind: "numberList",
  },
  {
    id: "alreadyPostedDepreciationMinor",
    label: "Already posted depreciation minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.assetPeriodChargesMinor.forEach((v) =>
    money(v, "assetPeriodChargesMinor"),
  );
  money(input.alreadyPostedDepreciationMinor, "alreadyPostedDepreciationMinor");
  const delta = integer(
    sumMoney(input.assetPeriodChargesMinor) -
      input.alreadyPostedDepreciationMinor,
    "trueUp",
  );
  return entry(
    ["DepreciationExpense", "AccumulatedDepreciation"],
    [delta, -delta],
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  assetPeriodChargesMinor: [50, 30],
  alreadyPostedDepreciationMinor: 60,
} satisfies Input;
export const exampleOutput = {
  postingAccounts: ["DepreciationExpense", "AccumulatedDepreciation"],
  postingDebitsMinor: [20, 0],
  postingCreditsMinor: [0, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/depreciation-journal-entry-generator-from-schedule",
  title: "Depreciation Journal Entry Generator From Schedule",
  description:
    "Generate balanced incremental depreciation journal from actual caller asset schedule charges and already posted aggregate expense, preserving reversal true-ups; schedule generation/asset useful lives are separate.",
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
      assetPeriodChargesMinor:
        value.assetPeriodChargesMinor as readonly number[],
      alreadyPostedDepreciationMinor:
        value.alreadyPostedDepreciationMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
