import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, count, runs } from "../shared.js";

export type Input = Readonly<{
  readonly dailyMeanTemperaturesC: readonly number[];
  readonly callerGrowingThresholdC: number;
  readonly callerRequiredRunDays: number;
  readonly searchColdEndFromIndex: number;
}>;
export type Output = Readonly<{
  readonly growingSeasonStartIndex: number;
  readonly growingSeasonEndIndexExclusive: number;
  readonly observedGrowingSeasonLengthDays: number;
  readonly endRightCensored: boolean;
  readonly onsetLeftCensored: boolean;
}>;
const inputFields = [
  {
    id: "dailyMeanTemperaturesC",
    label: "Daily mean temperatures c",
    kind: "numberList",
  },
  {
    id: "callerGrowingThresholdC",
    label: "Caller growing threshold c",
    kind: "number",
  },
  {
    id: "callerRequiredRunDays",
    label: "Caller required run days",
    kind: "integer",
  },
  {
    id: "searchColdEndFromIndex",
    label: "Search cold end from index",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerRequiredRunDays, "callerRequiredRunDays");
  count(input.callerRequiredRunDays, "callerRequiredRunDays");
  count(input.searchColdEndFromIndex, "searchColdEndFromIndex");
  if (input.searchColdEndFromIndex >= input.dailyMeanTemperaturesC.length)
    simpleError("search", "Cold-end search must begin inside observed season.");
  const a = runs(
    input.dailyMeanTemperaturesC.map((v) => v > input.callerGrowingThresholdC),
    input.callerRequiredRunDays,
  ).starts.find((i) => i < input.searchColdEndFromIndex);
  if (a === undefined)
    return simpleError(
      "start",
      "No warm onset run observed; do not infer unobserved onset.",
    );
  const end = runs(
      input.dailyMeanTemperaturesC.map(
        (v, i) =>
          i >= input.searchColdEndFromIndex &&
          v < input.callerGrowingThresholdC,
      ),
      input.callerRequiredRunDays,
    ).starts[0],
    censored = end === undefined;
  return {
    growingSeasonStartIndex: a,
    growingSeasonEndIndexExclusive: censored
      ? input.dailyMeanTemperaturesC.length
      : end,
    observedGrowingSeasonLengthDays:
      (censored ? input.dailyMeanTemperaturesC.length : end) - a,
    endRightCensored: censored,
    onsetLeftCensored: a === 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  dailyMeanTemperaturesC: [0, 10, 10, 10, 0, 0],
  callerGrowingThresholdC: 5,
  callerRequiredRunDays: 2,
  searchColdEndFromIndex: 3,
} satisfies Input;
export const exampleOutput = {
  growingSeasonStartIndex: 1,
  growingSeasonEndIndexExclusive: 4,
  observedGrowingSeasonLengthDays: 3,
  endRightCensored: false,
  onsetLeftCensored: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/growing-season-length",
  title: "Growing Season Length GSL",
  description:
    "Locate thermal growing-season onset/end under caller threshold/run and hemisphere-specific cold-end search index; preserve left-censored onset and right-censored end, without assigning dates outside supplied gap-free coverage.",
  inputs: inputFields,
  outputs: [
    { id: "onsetLeftCensored", label: "Onset left censored", kind: "boolean" },
    {
      id: "growingSeasonStartIndex",
      label: "Growing season start index",
      kind: "number",
    },
    {
      id: "growingSeasonEndIndexExclusive",
      label: "Growing season end index exclusive",
      kind: "number",
    },
    {
      id: "observedGrowingSeasonLengthDays",
      label: "Observed growing season length days",
      kind: "number",
    },
    { id: "endRightCensored", label: "End right censored", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      dailyMeanTemperaturesC: value.dailyMeanTemperaturesC as readonly number[],
      callerGrowingThresholdC: value.callerGrowingThresholdC as number,
      callerRequiredRunDays: value.callerRequiredRunDays as number,
      searchColdEndFromIndex: value.searchColdEndFromIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
