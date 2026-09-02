import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  mean,
  strictlyIncreasing,
  utcStamp,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedMoonriseUtcTimes: readonly string[];
}>;
export type Output = Readonly<{
  readonly observedDailyRiseDelayMinutes: readonly number[];
  readonly observedMeanRiseDelayMinutes: number;
}>;
const inputFields = [
  {
    id: "observedMoonriseUtcTimes",
    label: "Observed moonrise utc times",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.observedMoonriseUtcTimes.length < 2)
    simpleError("times", "At least2matched successive-day moonrise events.");
  const t = input.observedMoonriseUtcTimes.map(utcStamp);
  strictlyIncreasing(t, "events");
  const d = t.slice(1).map((v, i) => (v - t[i]) / 60000 - 1440);
  return {
    observedDailyRiseDelayMinutes: d,
    observedMeanRiseDelayMinutes: mean(d),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMoonriseUtcTimes: [
    "2026-01-01T00:00:00Z",
    "2026-01-02T00:50:00Z",
    "2026-01-03T01:20:00Z",
  ],
} satisfies Input;
export const exampleOutput = {
  observedDailyRiseDelayMinutes: [50, 30],
  observedMeanRiseDelayMinutes: 40,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/moon-rise-delay-per-day-minutes",
  title: "Moonrise Delay Minutes Per Day",
  description:
    "Actual consecutive lunar-rise timestamp offsets from 24 hours, signed delays retained; caller confirms consecutive events, not universal 50 minutes per day. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDailyRiseDelayMinutes",
      label: "Observed daily rise delay minutes",
      kind: "numberList",
    },
    {
      id: "observedMeanRiseDelayMinutes",
      label: "Observed mean rise delay minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMoonriseUtcTimes:
        value.observedMoonriseUtcTimes as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
