import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly observedTrueCount: number;
  readonly callerInsuranceCountThreshold: number;
  readonly callerEstimatedTenValueFraction: number;
  readonly callerNetInsurancePayoutMultiple: number;
}>;
export type Output = Readonly<{
  readonly meetsCallerCountThreshold: boolean;
  readonly insuranceNetEvPerUnitStake: number;
  readonly positiveInsuranceModelEv: boolean;
}>;
const inputFields = [
  { id: "observedTrueCount", label: "Observed true count", kind: "number" },
  {
    id: "callerInsuranceCountThreshold",
    label: "Caller insurance count threshold",
    kind: "number",
  },
  {
    id: "callerEstimatedTenValueFraction",
    label: "Caller estimated ten value fraction",
    kind: "number",
  },
  {
    id: "callerNetInsurancePayoutMultiple",
    label: "Caller net insurance payout multiple",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerNetInsurancePayoutMultiple,
    "callerNetInsurancePayoutMultiple",
  );
  fraction(
    input.callerEstimatedTenValueFraction,
    "callerEstimatedTenValueFraction",
  );
  const ev =
    input.callerEstimatedTenValueFraction *
      (input.callerNetInsurancePayoutMultiple + 1) -
    1;
  return {
    meetsCallerCountThreshold:
      input.observedTrueCount >= input.callerInsuranceCountThreshold,
    insuranceNetEvPerUnitStake: ev,
    positiveInsuranceModelEv: ev > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedTrueCount: 3,
  callerInsuranceCountThreshold: 3,
  callerEstimatedTenValueFraction: 0.3333333333333333,
  callerNetInsurancePayoutMultiple: 2,
} satisfies Input;
export const exampleOutput = {
  meetsCallerCountThreshold: true,
  insuranceNetEvPerUnitStake: 0,
  positiveInsuranceModelEv: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/blackjack-insurance-count-threshold-checker",
  title: "Insurance Count Threshold Check",
  description:
    "Separate caller count-threshold policy from insurance EV under supplied unseen ten-value fraction and net payout multiple; no embedded casino/count-system threshold or profit assurance.",
  inputs: inputFields,
  outputs: [
    {
      id: "meetsCallerCountThreshold",
      label: "Meets caller count threshold",
      kind: "boolean",
    },
    {
      id: "insuranceNetEvPerUnitStake",
      label: "Insurance net ev per unit stake",
      kind: "number",
    },
    {
      id: "positiveInsuranceModelEv",
      label: "Positive insurance model ev",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedTrueCount: value.observedTrueCount as number,
      callerInsuranceCountThreshold:
        value.callerInsuranceCountThreshold as number,
      callerEstimatedTenValueFraction:
        value.callerEstimatedTenValueFraction as number,
      callerNetInsurancePayoutMultiple:
        value.callerNetInsurancePayoutMultiple as number,
    }),
});
export const run = tool.execute;
export default tool;
