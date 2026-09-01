import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  bounded,
  mean,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedGamePins: readonly number[];
  readonly callerHandicapBasePins: number;
  readonly callerHandicapFraction: number;
  readonly callerMaximumHandicapPins: number;
}>;
export type Output = Readonly<{
  readonly observedMeanGamePins: number;
  readonly callerWholePinHandicap: number;
}>;
const inputFields = [
  { id: "observedGamePins", label: "Observed game pins", kind: "numberList" },
  {
    id: "callerHandicapBasePins",
    label: "Caller handicap base pins",
    kind: "number",
  },
  {
    id: "callerHandicapFraction",
    label: "Caller handicap fraction",
    kind: "number",
  },
  {
    id: "callerMaximumHandicapPins",
    label: "Caller maximum handicap pins",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedGamePins.forEach((v) => bounded(v, "pins", 0, 300));
  bounded(input.callerHandicapBasePins, "base", 0, 300);
  bounded(input.callerMaximumHandicapPins, "cap", 0, 300);
  fraction(input.callerHandicapFraction, "fraction");
  const average = mean(input.observedGamePins);
  return {
    observedMeanGamePins: average,
    callerWholePinHandicap: Math.min(
      input.callerMaximumHandicapPins,
      Math.floor(
        Math.max(0, input.callerHandicapBasePins - average) *
          input.callerHandicapFraction,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedGamePins: [150, 180, 210],
  callerHandicapBasePins: 220,
  callerHandicapFraction: 0.9,
  callerMaximumHandicapPins: 100,
} satisfies Input;
export const exampleOutput = {
  observedMeanGamePins: 180,
  callerWholePinHandicap: 36,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sports/bowling-handicap-pin-adjustment",
  title: "Bowling Handicap Pin Adjustment",
  description:
    "Apply caller bowling base/fraction/cap to actual game average, flooring nonnegative whole handicap pins; no league-policy default or rating certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedMeanGamePins",
      label: "Observed mean game pins",
      kind: "number",
    },
    {
      id: "callerWholePinHandicap",
      label: "Caller whole pin handicap",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedGamePins: value.observedGamePins as readonly number[],
      callerHandicapBasePins: value.callerHandicapBasePins as number,
      callerHandicapFraction: value.callerHandicapFraction as number,
      callerMaximumHandicapPins: value.callerMaximumHandicapPins as number,
    }),
});
export const run = tool.execute;
export default tool;
