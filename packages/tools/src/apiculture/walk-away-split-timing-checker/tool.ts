import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly queenlessStartDay: number;
  readonly youngestAvailableEggAgeDays: number;
  readonly eggToEmergenceDays: number;
  readonly minimumMatingDelayDays: number;
  readonly minimumPostMatingLayingDelayDays: number;
  readonly forageWindowEndDay: number;
}>;
export type Output = Readonly<{
  readonly modeledResumedLayingDay: number;
  readonly forageWindowMarginDays: number;
}>;
const inputFields = [
  { id: "queenlessStartDay", label: "Queenless start day", kind: "number" },
  {
    id: "youngestAvailableEggAgeDays",
    label: "Youngest available egg age days",
    kind: "number",
  },
  { id: "eggToEmergenceDays", label: "Egg to emergence days", kind: "number" },
  {
    id: "minimumMatingDelayDays",
    label: "Minimum mating delay days",
    kind: "number",
  },
  {
    id: "minimumPostMatingLayingDelayDays",
    label: "Minimum post mating laying delay days",
    kind: "number",
  },
  { id: "forageWindowEndDay", label: "Forage window end day", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.eggToEmergenceDays, "eggToEmergenceDays");
  nonnegative(input.youngestAvailableEggAgeDays, "youngestAvailableEggAgeDays");
  nonnegative(input.minimumMatingDelayDays, "minimumMatingDelayDays");
  nonnegative(
    input.minimumPostMatingLayingDelayDays,
    "minimumPostMatingLayingDelayDays",
  );
  if (input.youngestAvailableEggAgeDays > input.eggToEmergenceDays)
    simpleError(
      "youngestAvailableEggAgeDays",
      "Input egg age exceeds the supplied development model.",
    );
  const modeledResumedLayingDay =
    input.queenlessStartDay +
    input.eggToEmergenceDays -
    input.youngestAvailableEggAgeDays +
    input.minimumMatingDelayDays +
    input.minimumPostMatingLayingDelayDays;
  return {
    modeledResumedLayingDay,
    forageWindowMarginDays: input.forageWindowEndDay - modeledResumedLayingDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  queenlessStartDay: 0,
  youngestAvailableEggAgeDays: 1,
  eggToEmergenceDays: 16,
  minimumMatingDelayDays: 5,
  minimumPostMatingLayingDelayDays: 2,
  forageWindowEndDay: 20,
} satisfies Input;
export const exampleOutput = {
  modeledResumedLayingDay: 22,
  forageWindowMarginDays: -2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/walk-away-split-timing-checker",
  title: "Walk Away Split Timing Checker",
  description:
    "Screen a caller walk-away development/mating timing scenario against a forage horizon; no natural queen-development constants, mating success or split recommendation is embedded.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledResumedLayingDay",
      label: "Modeled resumed laying day",
      kind: "number",
    },
    {
      id: "forageWindowMarginDays",
      label: "Forage window margin days",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      queenlessStartDay: value.queenlessStartDay as number,
      youngestAvailableEggAgeDays: value.youngestAvailableEggAgeDays as number,
      eggToEmergenceDays: value.eggToEmergenceDays as number,
      minimumMatingDelayDays: value.minimumMatingDelayDays as number,
      minimumPostMatingLayingDelayDays:
        value.minimumPostMatingLayingDelayDays as number,
      forageWindowEndDay: value.forageWindowEndDay as number,
    }),
});
export const run = tool.execute;
export default tool;
