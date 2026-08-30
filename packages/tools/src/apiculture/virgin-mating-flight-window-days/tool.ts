import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, aligned } from "../shared.js";
export type Input = Readonly<{
  readonly queenAgesDays: readonly number[];
  readonly forecastTemperaturesC: readonly number[];
  readonly forecastWindSpeedsMPerSecond: readonly number[];
  readonly ageWindowDays: readonly number[];
  readonly minimumTemperatureC: number;
  readonly maximumWindSpeedMPerSecond: number;
}>;
export type Output = Readonly<{
  readonly modelEligibleDayIndexes: readonly number[];
}>;
const inputFields = [
  { id: "queenAgesDays", label: "Queen ages days", kind: "numberList" },
  {
    id: "forecastTemperaturesC",
    label: "Forecast temperatures c",
    kind: "numberList",
  },
  {
    id: "forecastWindSpeedsMPerSecond",
    label: "Forecast wind speeds m per second",
    kind: "numberList",
  },
  { id: "ageWindowDays", label: "Age window days", kind: "numberList" },
  { id: "minimumTemperatureC", label: "Minimum temperature c", kind: "number" },
  {
    id: "maximumWindSpeedMPerSecond",
    label: "Maximum wind speed m per second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.queenAgesDays.forEach((v) => nonnegative(v, "queenAgesDays"));
  input.forecastWindSpeedsMPerSecond.forEach((v) =>
    nonnegative(v, "forecastWindSpeedsMPerSecond"),
  );
  input.ageWindowDays.forEach((v) => nonnegative(v, "ageWindowDays"));
  nonnegative(input.maximumWindSpeedMPerSecond, "maximumWindSpeedMPerSecond");
  aligned(input.queenAgesDays, input.forecastTemperaturesC, "queenAgesDays");
  aligned(
    input.queenAgesDays,
    input.forecastWindSpeedsMPerSecond,
    "queenAgesDays",
  );
  if (
    input.ageWindowDays.length !== 2 ||
    input.ageWindowDays[0] > input.ageWindowDays[1]
  )
    simpleError(
      "ageWindowDays",
      "Ordered two-bound caller age window required.",
    );
  return {
    modelEligibleDayIndexes: input.queenAgesDays
      .map((a, i) =>
        a >= input.ageWindowDays[0] &&
        a <= input.ageWindowDays[1] &&
        input.forecastTemperaturesC[i] >= input.minimumTemperatureC &&
        input.forecastWindSpeedsMPerSecond[i] <=
          input.maximumWindSpeedMPerSecond
          ? i
          : -1,
      )
      .filter((i) => i >= 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  queenAgesDays: [4, 5, 6],
  forecastTemperaturesC: [18, 22, 24],
  forecastWindSpeedsMPerSecond: [1, 2, 5],
  ageWindowDays: [5, 8],
  minimumTemperatureC: 20,
  maximumWindSpeedMPerSecond: 3,
} satisfies Input;
export const exampleOutput = { modelEligibleDayIndexes: [1] } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/virgin-mating-flight-window-days",
  title: "Virgin Mating Flight Window Days",
  description:
    "Screen forecast days against supplied queen-age, temperature and wind windows; eligibility does not guarantee mating flights, drone availability or fertility.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelEligibleDayIndexes",
      label: "Model eligible day indexes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      queenAgesDays: value.queenAgesDays as readonly number[],
      forecastTemperaturesC: value.forecastTemperaturesC as readonly number[],
      forecastWindSpeedsMPerSecond:
        value.forecastWindSpeedsMPerSecond as readonly number[],
      ageWindowDays: value.ageWindowDays as readonly number[],
      minimumTemperatureC: value.minimumTemperatureC as number,
      maximumWindSpeedMPerSecond: value.maximumWindSpeedMPerSecond as number,
    }),
});
export const run = tool.execute;
export default tool;
