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
  fraction,
  count,
  aligned,
  ordered,
  crossing,
} from "../shared.js";
export type Input = Readonly<{
  readonly timeHours: readonly number[];
  readonly cumulativeAwakeLarvae: readonly number[];
  readonly observedLarvaCount: number;
  readonly wakeFraction: number;
  readonly moltStartHour: number;
}>;
export type Output = Readonly<{
  readonly wakeCriterionHour: number;
  readonly moltToWakeHours: number;
}>;
const inputFields = [
  { id: "timeHours", label: "Time hours", kind: "numberList" },
  {
    id: "cumulativeAwakeLarvae",
    label: "Cumulative awake larvae",
    kind: "numberList",
  },
  { id: "observedLarvaCount", label: "Observed larva count", kind: "integer" },
  { id: "wakeFraction", label: "Wake fraction", kind: "number" },
  { id: "moltStartHour", label: "Molt start hour", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedLarvaCount, "observedLarvaCount");
  positive(input.wakeFraction, "wakeFraction");
  fraction(input.wakeFraction, "wakeFraction");
  input.cumulativeAwakeLarvae.forEach((v) => count(v, "cumulativeAwakeLarvae"));
  count(input.observedLarvaCount, "observedLarvaCount");
  ordered(input.timeHours, "timeHours");
  aligned(input.timeHours, input.cumulativeAwakeLarvae, "timeHours");
  if (
    input.moltStartHour > input.timeHours[0] ||
    input.cumulativeAwakeLarvae.some(
      (v, i) =>
        v > input.observedLarvaCount ||
        (i > 0 && v < input.cumulativeAwakeLarvae[i - 1]),
    )
  )
    simpleError(
      "cumulativeAwakeLarvae",
      "Monotone cumulative counts within cohort and molt start no later than observation required.",
    );
  const wakeCriterionHour = crossing(
    input.timeHours,
    input.cumulativeAwakeLarvae,
    input.observedLarvaCount * input.wakeFraction,
  );
  return {
    wakeCriterionHour,
    moltToWakeHours: wakeCriterionHour - input.moltStartHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timeHours: [0, 4, 8],
  cumulativeAwakeLarvae: [0, 50, 100],
  observedLarvaCount: 100,
  wakeFraction: 0.5,
  moltStartHour: -2,
} satisfies Input;
export const exampleOutput = {
  wakeCriterionHour: 4,
  moltToWakeHours: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/instar-molt-wake-hours",
  title: "Instar Molt Wake Hours",
  description:
    "Interpolate an observed cohort wake-fraction crossing after molt start; missing or nonunique crossings are censored/ambiguous rather than assigned reference molt hours.",
  inputs: inputFields,
  outputs: [
    { id: "wakeCriterionHour", label: "Wake criterion hour", kind: "number" },
    { id: "moltToWakeHours", label: "Molt to wake hours", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timeHours: value.timeHours as readonly number[],
      cumulativeAwakeLarvae: value.cumulativeAwakeLarvae as readonly number[],
      observedLarvaCount: value.observedLarvaCount as number,
      wakeFraction: value.wakeFraction as number,
      moltStartHour: value.moltStartHour as number,
    }),
});
export const run = tool.execute;
export default tool;
