import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  strictlyIncreasing,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observationDays: readonly number[];
  readonly observedSurgeThresholdFrontPositionsM: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalSurgeFrontRatesMDay: readonly number[];
  readonly netThresholdFrontRateMDay: number;
}>;
const inputFields = [
  { id: "observationDays", label: "Observation days", kind: "numberList" },
  {
    id: "observedSurgeThresholdFrontPositionsM",
    label: "Observed surge threshold front positions m",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observationDays,
    input.observedSurgeThresholdFrontPositionsM,
    "observationDays",
  );
  strictlyIncreasing(input.observationDays, "days");
  const x = input.observedSurgeThresholdFrontPositionsM,
    t = input.observationDays;
  return {
    intervalSurgeFrontRatesMDay: x
      .slice(1)
      .map((v, i) => (v - x[i]) / (t[i + 1] - t[i])),
    netThresholdFrontRateMDay:
      (x[x.length - 1] - x[0]) / (t[t.length - 1] - t[0]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationDays: [0, 2, 5],
  observedSurgeThresholdFrontPositionsM: [0, 20, 50],
} satisfies Input;
export const exampleOutput = {
  intervalSurgeFrontRatesMDay: [10, 10],
  netThresholdFrontRateMDay: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/surge-front-advance-rate",
  title: "Surge Front Advance Rate Calculator",
  description:
    "Track actual caller-defined surge activation threshold front between observations in m/day; not ice particle velocity, calving-minus-flow integration or a surge onset forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalSurgeFrontRatesMDay",
      label: "Interval surge front rates m day",
      kind: "numberList",
    },
    {
      id: "netThresholdFrontRateMDay",
      label: "Net threshold front rate m day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observationDays: value.observationDays as readonly number[],
      observedSurgeThresholdFrontPositionsM:
        value.observedSurgeThresholdFrontPositionsM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
