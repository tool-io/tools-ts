import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, maximum, runs } from "../shared.js";

export type Input = Readonly<{
  readonly dailyMinimumTemperaturesC: readonly number[];
  readonly callerFrostThresholdC: number;
}>;
export type Output = Readonly<{
  readonly longestObservedFrostFreeDays: number;
  readonly firstLongestRunStartIndex: number;
  readonly leftBoundaryCensored: boolean;
  readonly rightBoundaryCensored: boolean;
}>;
const inputFields = [
  {
    id: "dailyMinimumTemperaturesC",
    label: "Daily minimum temperatures c",
    kind: "numberList",
  },
  {
    id: "callerFrostThresholdC",
    label: "Caller frost threshold c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.dailyMinimumTemperaturesC.length)
    simpleError("days", "Observed gap-free daily sequence required.");
  const r = runs(
    input.dailyMinimumTemperaturesC.map(
      (v) => v >= input.callerFrostThresholdC,
    ),
  );
  if (!r.lengths.length)
    return {
      longestObservedFrostFreeDays: 0,
      firstLongestRunStartIndex: -1,
      leftBoundaryCensored: false,
      rightBoundaryCensored: false,
    };
  const length = maximum(r.lengths),
    index = r.lengths.indexOf(length),
    start = r.starts[index];
  return {
    longestObservedFrostFreeDays: length,
    firstLongestRunStartIndex: start,
    leftBoundaryCensored: start === 0,
    rightBoundaryCensored:
      start + length === input.dailyMinimumTemperaturesC.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyMinimumTemperaturesC: [-1, 2, 3, 4, -1],
  callerFrostThresholdC: 0,
} satisfies Input;
export const exampleOutput = {
  longestObservedFrostFreeDays: 3,
  firstLongestRunStartIndex: 1,
  leftBoundaryCensored: false,
  rightBoundaryCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/frost-free-period",
  title: "Frost-Free Period Length",
  description:
    "Find longest observed contiguous frost-free daily period with explicit endpoint censoring; unlike one seasonal frost date, longest available span is not extrapolated outside coverage.",
  inputs: inputFields,
  outputs: [
    {
      id: "longestObservedFrostFreeDays",
      label: "Longest observed frost free days",
      kind: "number",
    },
    {
      id: "firstLongestRunStartIndex",
      label: "First longest run start index",
      kind: "number",
    },
    {
      id: "leftBoundaryCensored",
      label: "Left boundary censored",
      kind: "boolean",
    },
    {
      id: "rightBoundaryCensored",
      label: "Right boundary censored",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      dailyMinimumTemperaturesC:
        value.dailyMinimumTemperaturesC as readonly number[],
      callerFrostThresholdC: value.callerFrostThresholdC as number,
    }),
});
export const run = tool.execute;
export default tool;
