import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly phaseEnergyWatts: readonly number[];
  readonly phaseDurationsMinutes: readonly number[];
  readonly restPhaseFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly timeWeightedCycleEnergyWatts: number;
  readonly restFraction: number;
  readonly totalCycleMinutes: number;
}>;
const inputFields = [
  { id: "phaseEnergyWatts", label: "Phase energy watts", kind: "numberList" },
  {
    id: "phaseDurationsMinutes",
    label: "Phase durations minutes",
    kind: "numberList",
  },
  { id: "restPhaseFlags", label: "Rest phase flags", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.phaseEnergyWatts.forEach((v) => nonnegative(v, "phaseEnergyWatts"));
  input.phaseDurationsMinutes.forEach((v) =>
    nonnegative(v, "phaseDurationsMinutes"),
  );
  aligned(
    input.phaseEnergyWatts,
    input.phaseDurationsMinutes,
    "phaseEnergyWatts",
  );
  aligned(input.phaseEnergyWatts, input.restPhaseFlags, "phaseEnergyWatts");
  binary(input.restPhaseFlags, "restFlags");
  const time = positive(sum(input.phaseDurationsMinutes), "cycleDuration");
  return {
    timeWeightedCycleEnergyWatts: input.phaseEnergyWatts.reduce(
      (s, v, i) => s + (v * input.phaseDurationsMinutes[i]) / time,
      0,
    ),
    restFraction: input.restPhaseFlags.reduce(
      (s, v, i) => s + (v * input.phaseDurationsMinutes[i]) / time,
      0,
    ),
    totalCycleMinutes: time,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phaseEnergyWatts: [300, 100],
  phaseDurationsMinutes: [10, 5],
  restPhaseFlags: [0, 1],
} satisfies Input;
export const exampleOutput = {
  timeWeightedCycleEnergyWatts: 233.33333333333334,
  restFraction: 0.3333333333333333,
  totalCycleMinutes: 15,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/work-rest-energy-average",
  title: "Work-Rest Cycle Energy Expenditure Average Calculator",
  description:
    "Audit actual heterogeneous work/rest phase energy exposure and separately classified rest time; distinct from inverting an allowed mean, no endurance or sustainable-work guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "timeWeightedCycleEnergyWatts",
      label: "Time weighted cycle energy watts",
      kind: "number",
    },
    { id: "restFraction", label: "Rest fraction", kind: "number" },
    { id: "totalCycleMinutes", label: "Total cycle minutes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      phaseEnergyWatts: value.phaseEnergyWatts as readonly number[],
      phaseDurationsMinutes: value.phaseDurationsMinutes as readonly number[],
      restPhaseFlags: value.restPhaseFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
