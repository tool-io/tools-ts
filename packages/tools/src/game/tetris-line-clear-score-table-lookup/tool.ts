import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  lines,
  bounded,
} from "../shared.js";
export type Input = Readonly<{
  readonly clearedLines: number;
  readonly currentZeroBasedLevel: number;
  readonly callerBaseLineScores: readonly number[];
  readonly precedingEligibleClearWasTetris: boolean;
  readonly callerBackToBackTetrisMultiplier: number;
  readonly callerComboBonusPoints: number;
}>;
export type Output = Readonly<{
  readonly unmultipliedLineClearPoints: number;
  readonly backToBackMultiplierApplied: number;
  readonly totalCallerModelPoints: number;
}>;
const inputFields = [
  { id: "clearedLines", label: "Cleared lines", kind: "number" },
  {
    id: "currentZeroBasedLevel",
    label: "Current zero based level",
    kind: "number",
  },
  {
    id: "callerBaseLineScores",
    label: "Caller base line scores",
    kind: "numberList",
  },
  {
    id: "precedingEligibleClearWasTetris",
    label: "Preceding eligible clear was tetris",
    kind: "boolean",
  },
  {
    id: "callerBackToBackTetrisMultiplier",
    label: "Caller back to back tetris multiplier",
    kind: "number",
  },
  {
    id: "callerComboBonusPoints",
    label: "Caller combo bonus points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerBackToBackTetrisMultiplier,
    "callerBackToBackTetrisMultiplier",
  );
  input.callerBaseLineScores.forEach((v) =>
    nonnegative(v, "callerBaseLineScores"),
  );
  nonnegative(input.callerComboBonusPoints, "callerComboBonusPoints");
  bounded(input.clearedLines, "lines", 0, 4);
  bounded(input.currentZeroBasedLevel, "level", 0, 1000);
  if (input.callerBaseLineScores.length !== 5)
    simpleError(
      "table",
      "Five caller scores for zero through four cleared lines required.",
    );
  const base = input.callerBaseLineScores[input.clearedLines],
    mult =
      input.clearedLines === 4 && input.precedingEligibleClearWasTetris
        ? input.callerBackToBackTetrisMultiplier
        : 1;
  return {
    unmultipliedLineClearPoints: base,
    backToBackMultiplierApplied: mult,
    totalCallerModelPoints:
      base * (input.currentZeroBasedLevel + 1) * mult +
      input.callerComboBonusPoints,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  clearedLines: 4,
  currentZeroBasedLevel: 1,
  callerBaseLineScores: [0, 100, 300, 500, 800],
  precedingEligibleClearWasTetris: true,
  callerBackToBackTetrisMultiplier: 1.5,
  callerComboBonusPoints: 0,
} satisfies Input;
export const exampleOutput = {
  unmultipliedLineClearPoints: 800,
  backToBackMultiplierApplied: 1.5,
  totalCallerModelPoints: 2400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/tetris-line-clear-score-table-lookup",
  title: "Tetris Line Clear Score Table",
  description:
    "Apply explicit line-score table, zero-based level+1 multiplier, caller back-to-back Tetris factor and already computed combo points; no hidden guideline edition, T-spin or perfect-clear rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "unmultipliedLineClearPoints",
      label: "Unmultiplied line clear points",
      kind: "number",
    },
    {
      id: "backToBackMultiplierApplied",
      label: "Back to back multiplier applied",
      kind: "number",
    },
    {
      id: "totalCallerModelPoints",
      label: "Total caller model points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      clearedLines: value.clearedLines as number,
      currentZeroBasedLevel: value.currentZeroBasedLevel as number,
      callerBaseLineScores: value.callerBaseLineScores as readonly number[],
      precedingEligibleClearWasTetris:
        value.precedingEligibleClearWasTetris as boolean,
      callerBackToBackTetrisMultiplier:
        value.callerBackToBackTetrisMultiplier as number,
      callerComboBonusPoints: value.callerComboBonusPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
