import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  integer,
  sumMoney,
  positive,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly eligibleSpendMinor: readonly number[];
  readonly observedRewardValueMinor: readonly number[];
  readonly allocatedCardFeesMinor: number;
}>;
export type Output = Readonly<{
  readonly totalObservedRewardValueMinor: number;
  readonly netObservedRewardsMinor: number;
  readonly effectiveNetRewardPercent: number;
}>;
const inputFields = [
  {
    id: "eligibleSpendMinor",
    label: "Eligible spend minor",
    kind: "numberList",
  },
  {
    id: "observedRewardValueMinor",
    label: "Observed reward value minor",
    kind: "numberList",
  },
  {
    id: "allocatedCardFeesMinor",
    label: "Allocated card fees minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.eligibleSpendMinor.forEach((v) => money(v, "eligibleSpendMinor"));
  input.observedRewardValueMinor.forEach((v) =>
    money(v, "observedRewardValueMinor"),
  );
  money(input.allocatedCardFeesMinor, "allocatedCardFeesMinor");
  aligned(
    input.eligibleSpendMinor,
    input.observedRewardValueMinor,
    "eligibleSpendMinor",
  );
  const spend = positive(sumMoney(input.eligibleSpendMinor), "spend"),
    value = sumMoney(input.observedRewardValueMinor),
    net = integer(value - input.allocatedCardFeesMinor, "netRewards");
  return {
    totalObservedRewardValueMinor: value,
    netObservedRewardsMinor: net,
    effectiveNetRewardPercent: (100 * net) / spend,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eligibleSpendMinor: [10000, 10000],
  observedRewardValueMinor: [300, 200],
  allocatedCardFeesMinor: 100,
} satisfies Input;
export const exampleOutput = {
  totalObservedRewardValueMinor: 500,
  netObservedRewardsMinor: 400,
  effectiveNetRewardPercent: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/rewards-effective-value-percent",
  title: "Rewards Effective Value Percent Calculator",
  description:
    "Audit realized caller reward redemption values against actual eligible spend and allocated fees, preserving negative net value; no invented point valuation, future rewards promise or gross-rate comparison alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalObservedRewardValueMinor",
      label: "Total observed reward value minor",
      kind: "number",
    },
    {
      id: "netObservedRewardsMinor",
      label: "Net observed rewards minor",
      kind: "number",
    },
    {
      id: "effectiveNetRewardPercent",
      label: "Effective net reward percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eligibleSpendMinor: value.eligibleSpendMinor as readonly number[],
      observedRewardValueMinor:
        value.observedRewardValueMinor as readonly number[],
      allocatedCardFeesMinor: value.allocatedCardFeesMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
