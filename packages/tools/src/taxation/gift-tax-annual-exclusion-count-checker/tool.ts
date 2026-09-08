import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, sumMoney } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerAggregatedRecipientGiftsMinor: readonly number[];
  readonly callerApplicableAnnualExclusionMinor: number;
}>;
export type Output = Readonly<{
  readonly exclusionUsedPerRecipientMinor: readonly number[];
  readonly aboveExclusionPerRecipientMinor: readonly number[];
  readonly totalAboveExclusionMinor: number;
}>;
const inputFields = [
  {
    id: "callerAggregatedRecipientGiftsMinor",
    label: "Caller aggregated recipient gifts minor",
    kind: "numberList",
  },
  {
    id: "callerApplicableAnnualExclusionMinor",
    label: "Caller applicable annual exclusion minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerAggregatedRecipientGiftsMinor.forEach((v) =>
    money(v, "callerAggregatedRecipientGiftsMinor"),
  );
  money(
    input.callerApplicableAnnualExclusionMinor,
    "callerApplicableAnnualExclusionMinor",
  );
  const above = input.callerAggregatedRecipientGiftsMinor.map((v) =>
    Math.max(0, v - input.callerApplicableAnnualExclusionMinor),
  );
  return {
    exclusionUsedPerRecipientMinor:
      input.callerAggregatedRecipientGiftsMinor.map((v) =>
        Math.min(v, input.callerApplicableAnnualExclusionMinor),
      ),
    aboveExclusionPerRecipientMinor: above,
    totalAboveExclusionMinor: sumMoney(above),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAggregatedRecipientGiftsMinor: [100, 40],
  callerApplicableAnnualExclusionMinor: 60,
} satisfies Input;
export const exampleOutput = {
  exclusionUsedPerRecipientMinor: [60, 40],
  aboveExclusionPerRecipientMinor: [40, 0],
  totalAboveExclusionMinor: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/gift-tax-annual-exclusion-count-checker",
  title: "Gift Tax Annual Exclusion Count Checker",
  description:
    "Each independently aggregated eligible recipient-year gift exclusion, no aggregate exclusion applied twice or actual payable gift tax. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "exclusionUsedPerRecipientMinor",
      label: "Exclusion used per recipient minor",
      kind: "numberList",
    },
    {
      id: "aboveExclusionPerRecipientMinor",
      label: "Above exclusion per recipient minor",
      kind: "numberList",
    },
    {
      id: "totalAboveExclusionMinor",
      label: "Total above exclusion minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAggregatedRecipientGiftsMinor:
        value.callerAggregatedRecipientGiftsMinor as readonly number[],
      callerApplicableAnnualExclusionMinor:
        value.callerApplicableAnnualExclusionMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
