import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly observationDays: readonly number[];
  readonly observedBrix: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalSignedBrixChangesPerWeek: readonly number[];
  readonly wholeObservedPeriodBrixChangePerWeek: number;
}>;
const inputFields = [
  { id: "observationDays", label: "Observation days", kind: "numberList" },
  { id: "observedBrix", label: "Observed brix", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedBrix.forEach((v) => nonnegative(v, "observedBrix"));
  aligned(input.observationDays, input.observedBrix, "observationDays");
  ordered(input.observationDays, "days");
  return {
    intervalSignedBrixChangesPerWeek: input.observedBrix
      .slice(1)
      .map(
        (v, i) =>
          (7 * (v - input.observedBrix[i])) /
          (input.observationDays[i + 1] - input.observationDays[i]),
      ),
    wholeObservedPeriodBrixChangePerWeek:
      (7 * (input.observedBrix.at(-1)! - input.observedBrix[0])) /
      (input.observationDays.at(-1)! - input.observationDays[0]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationDays: [0, 7, 21],
  observedBrix: [10, 12, 10],
} satisfies Input;
export const exampleOutput = {
  intervalSignedBrixChangesPerWeek: [2, -1],
  wholeObservedPeriodBrixChangePerWeek: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/sugar-accumulation-brix-per-week",
  title: "Sugar Accumulation Brix Per Week",
  description:
    "Track measured signed Brix changes on actual unequal sampling periods, retaining decreases; not sugar production mass, alcohol conversion or a harvest-ready prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalSignedBrixChangesPerWeek",
      label: "Interval signed brix changes per week",
      kind: "numberList",
    },
    {
      id: "wholeObservedPeriodBrixChangePerWeek",
      label: "Whole observed period brix change per week",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observationDays: value.observationDays as readonly number[],
      observedBrix: value.observedBrix as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
