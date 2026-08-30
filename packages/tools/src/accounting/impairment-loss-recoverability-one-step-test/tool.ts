import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money } from "../batch-shared.js";
export type Input = Readonly<{
  readonly carryingAmountMinor: number;
  readonly fairValueLessDisposalCostsMinor: number;
  readonly valueInUseMinor: number;
}>;
export type Output = Readonly<{
  readonly callerOneStepRecoverableAmountMinor: number;
  readonly oneStepImpairmentLossMinor: number;
  readonly postTestCarryingMinor: number;
}>;
const inputFields = [
  { id: "carryingAmountMinor", label: "Carrying amount minor", kind: "number" },
  {
    id: "fairValueLessDisposalCostsMinor",
    label: "Fair value less disposal costs minor",
    kind: "number",
  },
  { id: "valueInUseMinor", label: "Value in use minor", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.carryingAmountMinor, "carryingAmountMinor");
  money(
    input.fairValueLessDisposalCostsMinor,
    "fairValueLessDisposalCostsMinor",
  );
  money(input.valueInUseMinor, "valueInUseMinor");
  const recover = Math.max(
      input.fairValueLessDisposalCostsMinor,
      input.valueInUseMinor,
    ),
    loss = Math.max(0, input.carryingAmountMinor - recover);
  return {
    callerOneStepRecoverableAmountMinor: recover,
    oneStepImpairmentLossMinor: loss,
    postTestCarryingMinor: input.carryingAmountMinor - loss,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  carryingAmountMinor: 1000,
  fairValueLessDisposalCostsMinor: 600,
  valueInUseMinor: 800,
} satisfies Input;
export const exampleOutput = {
  callerOneStepRecoverableAmountMinor: 800,
  oneStepImpairmentLossMinor: 200,
  postTestCarryingMinor: 800,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/impairment-loss-recoverability-one-step-test",
  title: "Impairment Loss Recoverability One Step Test Tool",
  description:
    "Apply declared one-step recoverable-amount model using higher FV-less-disposal/value-in-use, without an undiscounted-cash recoverability gate; not interchangeable with US GAAP two-step long-lived-asset tests or impairment reversal rules.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerOneStepRecoverableAmountMinor",
      label: "Caller one step recoverable amount minor",
      kind: "number",
    },
    {
      id: "oneStepImpairmentLossMinor",
      label: "One step impairment loss minor",
      kind: "number",
    },
    {
      id: "postTestCarryingMinor",
      label: "Post test carrying minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      carryingAmountMinor: value.carryingAmountMinor as number,
      fairValueLessDisposalCostsMinor:
        value.fairValueLessDisposalCostsMinor as number,
      valueInUseMinor: value.valueInUseMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
