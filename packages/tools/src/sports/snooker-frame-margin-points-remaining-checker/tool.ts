import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, sum } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedLeadingScore: number;
  readonly observedTrailingScore: number;
  readonly observedRemainingReds: number;
  readonly callerOrderedColorValues: readonly number[];
  readonly callerBlackValue: number;
}>;
export type Output = Readonly<{
  readonly scoreLead: number;
  readonly maximumOrdinaryPointsRemaining: number;
  readonly signedLeadMinusRemainingPoints: number;
  readonly snookersRequiredToExceedLead: boolean;
}>;
const inputFields = [
  {
    id: "observedLeadingScore",
    label: "Observed leading score",
    kind: "number",
  },
  {
    id: "observedTrailingScore",
    label: "Observed trailing score",
    kind: "number",
  },
  {
    id: "observedRemainingReds",
    label: "Observed remaining reds",
    kind: "number",
  },
  {
    id: "callerOrderedColorValues",
    label: "Caller ordered color values",
    kind: "numberList",
  },
  { id: "callerBlackValue", label: "Caller black value", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedLeadingScore, "score", 0, 1000);
  bounded(input.observedTrailingScore, "score", 0, input.observedLeadingScore);
  bounded(input.observedRemainingReds, "reds", 0, 15);
  input.callerOrderedColorValues.forEach((v) => bounded(v, "color", 1, 20));
  bounded(input.callerBlackValue, "black", 1, 20);
  if (input.callerOrderedColorValues.length !== 6)
    simpleError(
      "colors",
      "Six explicit remaining standard end-colors required.",
    );
  const lead = input.observedLeadingScore - input.observedTrailingScore,
    remaining =
      input.observedRemainingReds * (1 + input.callerBlackValue) +
      sum(input.callerOrderedColorValues);
  return {
    scoreLead: lead,
    maximumOrdinaryPointsRemaining: remaining,
    signedLeadMinusRemainingPoints: lead - remaining,
    snookersRequiredToExceedLead: lead >= remaining,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLeadingScore: 60,
  observedTrailingScore: 30,
  observedRemainingReds: 2,
  callerOrderedColorValues: [2, 3, 4, 5, 6, 7],
  callerBlackValue: 7,
} satisfies Input;
export const exampleOutput = {
  scoreLead: 30,
  maximumOrdinaryPointsRemaining: 43,
  signedLeadMinusRemainingPoints: -13,
  snookersRequiredToExceedLead: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/snooker-frame-margin-points-remaining-checker",
  title: "Snooker Points Remaining Margin Checker",
  description:
    "Audit observed snooker lead versus ordinary red-plus-max-color and final-color inventory; ties require extra foul points to exceed, respotted black/fouls/free balls excluded.",
  inputs: inputFields,
  outputs: [
    { id: "scoreLead", label: "Score lead", kind: "number" },
    {
      id: "maximumOrdinaryPointsRemaining",
      label: "Maximum ordinary points remaining",
      kind: "number",
    },
    {
      id: "signedLeadMinusRemainingPoints",
      label: "Signed lead minus remaining points",
      kind: "number",
    },
    {
      id: "snookersRequiredToExceedLead",
      label: "Snookers required to exceed lead",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLeadingScore: value.observedLeadingScore as number,
      observedTrailingScore: value.observedTrailingScore as number,
      observedRemainingReds: value.observedRemainingReds as number,
      callerOrderedColorValues:
        value.callerOrderedColorValues as readonly number[],
      callerBlackValue: value.callerBlackValue as number,
    }),
});
export const run = tool.execute;
export default tool;
