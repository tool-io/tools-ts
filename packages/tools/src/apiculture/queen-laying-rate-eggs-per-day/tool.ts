import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesDays: readonly number[];
  readonly cumulativeObservedEggCounts: readonly number[];
  readonly estimatedEggLossesPerInterval: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalLayingRatesEggsPerDay: readonly number[];
  readonly overallLayingRateEggsPerDay: number;
}>;
const inputFields = [
  { id: "timesDays", label: "Times days", kind: "numberList" },
  {
    id: "cumulativeObservedEggCounts",
    label: "Cumulative observed egg counts",
    kind: "numberList",
  },
  {
    id: "estimatedEggLossesPerInterval",
    label: "Estimated egg losses per interval",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.cumulativeObservedEggCounts.forEach((v) =>
    count(v, "cumulativeObservedEggCounts"),
  );
  input.estimatedEggLossesPerInterval.forEach((v) =>
    count(v, "estimatedEggLossesPerInterval"),
  );
  ordered(input.timesDays, "timesDays");
  aligned(input.timesDays, input.cumulativeObservedEggCounts, "timesDays");
  aligned(
    input.timesDays.slice(1),
    input.estimatedEggLossesPerInterval,
    "estimatedEggLossesPerInterval",
  );
  const produced = input.timesDays
    .slice(1)
    .map((_, i) =>
      nonnegative(
        input.cumulativeObservedEggCounts[i + 1] -
          input.cumulativeObservedEggCounts[i] +
          input.estimatedEggLossesPerInterval[i],
        "cumulativeObservedEggCounts",
      ),
    );
  return {
    intervalLayingRatesEggsPerDay: produced.map(
      (v, i) => v / (input.timesDays[i + 1] - input.timesDays[i]),
    ),
    overallLayingRateEggsPerDay:
      produced.reduce((a, b) => a + b, 0) /
      (input.timesDays.at(-1)! - input.timesDays[0]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesDays: [0, 1, 2],
  cumulativeObservedEggCounts: [0, 100, 300],
  estimatedEggLossesPerInterval: [0, 20],
} satisfies Input;
export const exampleOutput = {
  intervalLayingRatesEggsPerDay: [100, 220],
  overallLayingRateEggsPerDay: 160,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/queen-laying-rate-eggs-per-day",
  title: "Queen Laying Rate Eggs Per Day",
  description:
    "Infer interval laying from cumulative observed eggs plus independently supplied egg-loss corrections; migration, unobserved brood and colony-wide representativeness are external.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalLayingRatesEggsPerDay",
      label: "Interval laying rates eggs per day",
      kind: "numberList",
    },
    {
      id: "overallLayingRateEggsPerDay",
      label: "Overall laying rate eggs per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      timesDays: value.timesDays as readonly number[],
      cumulativeObservedEggCounts:
        value.cumulativeObservedEggCounts as readonly number[],
      estimatedEggLossesPerInterval:
        value.estimatedEggLossesPerInterval as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
