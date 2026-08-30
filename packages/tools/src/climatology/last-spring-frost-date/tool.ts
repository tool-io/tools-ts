import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, count } from "../shared.js";

export type Input = Readonly<{
  readonly dailyMinimumTemperaturesC: readonly number[];
  readonly seasonStartIndex: number;
  readonly seasonEndIndexInclusive: number;
  readonly callerFrostThresholdC: number;
}>;
export type Output = Readonly<{
  readonly observedFrostFound: boolean;
  readonly frostDayIndex: number;
}>;
const inputFields = [
  {
    id: "dailyMinimumTemperaturesC",
    label: "Daily minimum temperatures c",
    kind: "numberList",
  },
  { id: "seasonStartIndex", label: "Season start index", kind: "integer" },
  {
    id: "seasonEndIndexInclusive",
    label: "Season end index inclusive",
    kind: "integer",
  },
  {
    id: "callerFrostThresholdC",
    label: "Caller frost threshold c",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  count(input.seasonStartIndex, "seasonStartIndex");
  count(input.seasonEndIndexInclusive, "seasonEndIndexInclusive");
  if (
    input.seasonStartIndex > input.seasonEndIndexInclusive ||
    input.seasonEndIndexInclusive >= input.dailyMinimumTemperaturesC.length
  )
    simpleError("window", "Inclusive observed seasonal window required.");
  const indices = input.dailyMinimumTemperaturesC.flatMap((v, i) =>
      i >= input.seasonStartIndex &&
      i <= input.seasonEndIndexInclusive &&
      v < input.callerFrostThresholdC
        ? [i]
        : [],
    ),
    index = indices.at(-1);
  return {
    observedFrostFound: index !== undefined,
    frostDayIndex: index ?? -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyMinimumTemperaturesC: [2, -1, 3, -2],
  seasonStartIndex: 1,
  seasonEndIndexInclusive: 3,
  callerFrostThresholdC: 0,
} satisfies Input;
export const exampleOutput = {
  observedFrostFound: true,
  frostDayIndex: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/last-spring-frost-date",
  title: "Last Spring Frost Date Finder",
  description:
    "Locate last spring observed frost within caller seasonal window; -1 explicitly means no observed event and is not a validated frost-free date, calendar/hemisphere determined by caller.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFrostFound",
      label: "Observed frost found",
      kind: "boolean",
    },
    { id: "frostDayIndex", label: "Frost day index", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      dailyMinimumTemperaturesC:
        value.dailyMinimumTemperaturesC as readonly number[],
      seasonStartIndex: value.seasonStartIndex as number,
      seasonEndIndexInclusive: value.seasonEndIndexInclusive as number,
      callerFrostThresholdC: value.callerFrostThresholdC as number,
    }),
});
export const run = tool.execute;
export default tool;
