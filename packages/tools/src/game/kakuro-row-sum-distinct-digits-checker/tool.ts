import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, sum, bounded } from "../shared.js";
export type Input = Readonly<{
  readonly observedDigitsWithZeroUnknown: readonly number[];
  readonly targetSum: number;
}>;
export type Output = Readonly<{
  readonly observedKnownSum: number;
  readonly knownDigitsDistinct: boolean;
  readonly allDigitsObserved: boolean;
  readonly unorderedRemainingDigitSetsCount: number;
  readonly completeSumMatches: boolean;
}>;
const inputFields = [
  {
    id: "observedDigitsWithZeroUnknown",
    label: "Observed digits with zero unknown",
    kind: "numberList",
  },
  { id: "targetSum", label: "Target sum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.observedDigitsWithZeroUnknown.length ||
    input.observedDigitsWithZeroUnknown.length > 9
  )
    simpleError(
      "digits",
      "Kakuro run must have 1–9 cells; zero means unknown.",
    );
  input.observedDigitsWithZeroUnknown.forEach((v) => bounded(v, "digit", 0, 9));
  bounded(input.targetSum, "sum", 1, 45);
  const known = input.observedDigitsWithZeroUnknown.filter((v) => v > 0),
    distinct = new Set(known).size === known.length,
    missing = input.observedDigitsWithZeroUnknown.length - known.length,
    total = sum(known),
    remaining = Array.from({ length: 9 }, (_, i) => i + 1).filter(
      (v) => !known.includes(v),
    );
  let n = 0;
  if (distinct)
    for (let mask = 0; mask < 2 ** remaining.length; mask++) {
      const set = remaining.filter((_, i) => mask & (1 << i));
      if (set.length === missing && sum(set) + total === input.targetSum) n++;
    }
  return {
    observedKnownSum: total,
    knownDigitsDistinct: distinct,
    allDigitsObserved: missing === 0,
    unorderedRemainingDigitSetsCount: n,
    completeSumMatches: distinct && missing === 0 && total === input.targetSum,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDigitsWithZeroUnknown: [1, 2, 0],
  targetSum: 9,
} satisfies Input;
export const exampleOutput = {
  observedKnownSum: 3,
  knownDigitsDistinct: true,
  allDigitsObserved: false,
  unorderedRemainingDigitSetsCount: 1,
  completeSumMatches: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/kakuro-row-sum-distinct-digits-checker",
  title: "Kakuro Row Sum Distinct Digits Check",
  description:
    "Audit partial Kakuro run with explicit unknown cells, digit uniqueness and exact unordered remaining digit-set completions; duplicate known digits remain observed invalidity, not silently repaired or full-grid solution.",
  inputs: inputFields,
  outputs: [
    { id: "observedKnownSum", label: "Observed known sum", kind: "number" },
    {
      id: "knownDigitsDistinct",
      label: "Known digits distinct",
      kind: "boolean",
    },
    { id: "allDigitsObserved", label: "All digits observed", kind: "boolean" },
    {
      id: "unorderedRemainingDigitSetsCount",
      label: "Unordered remaining digit sets count",
      kind: "number",
    },
    {
      id: "completeSumMatches",
      label: "Complete sum matches",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDigitsWithZeroUnknown:
        value.observedDigitsWithZeroUnknown as readonly number[],
      targetSum: value.targetSum as number,
    }),
});
export const run = tool.execute;
export default tool;
