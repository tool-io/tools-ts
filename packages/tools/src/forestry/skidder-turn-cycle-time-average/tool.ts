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
  nonnegative,
  aligned,
  mean,
  shape,
} from "../shared.js";
export type Input = Readonly<{
  readonly cyclePhaseTimesMinutes: readonly (readonly number[])[];
  readonly turnPayloadVolumesM3: readonly number[];
}>;
export type Output = Readonly<{
  readonly turnCycleTimesMinutes: readonly number[];
  readonly meanCycleTimeMinutes: number;
  readonly observedTurnPayloadThroughputM3PerHour: number;
}>;
const inputFields = [
  {
    id: "cyclePhaseTimesMinutes",
    label: "Cycle phase times minutes",
    kind: "matrix",
  },
  {
    id: "turnPayloadVolumesM3",
    label: "Turn payload volumes m3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.turnPayloadVolumesM3.forEach((v) =>
    positive(v, "turnPayloadVolumesM3"),
  );
  if (shape(input.cyclePhaseTimesMinutes, "cyclePhaseTimesMinutes") !== 4)
    simpleError(
      "phases",
      "Four observed unloaded travel, loading, loaded travel and unloading phases required.",
    );
  aligned(input.cyclePhaseTimesMinutes, input.turnPayloadVolumesM3, "turns");
  const turnCycleTimesMinutes = input.cyclePhaseTimesMinutes.map((row) => {
    row.forEach((v) => nonnegative(v, "phaseTimes"));
    return positive(
      row.reduce((a, b) => a + b, 0),
      "cycleTime",
    );
  });
  return {
    turnCycleTimesMinutes,
    meanCycleTimeMinutes: mean(turnCycleTimesMinutes),
    observedTurnPayloadThroughputM3PerHour:
      (60 * input.turnPayloadVolumesM3.reduce((a, b) => a + b, 0)) /
      turnCycleTimesMinutes.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cyclePhaseTimesMinutes: [
    [1, 2, 3, 4],
    [2, 2, 2, 2],
  ],
  turnPayloadVolumesM3: [2, 4],
} satisfies Input;
export const exampleOutput = {
  turnCycleTimesMinutes: [10, 8],
  meanCycleTimeMinutes: 9,
  observedTurnPayloadThroughputM3PerHour: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/skidder-turn-cycle-time-average",
  title: "Average Skidder Turn Cycle Time",
  description:
    "Audit complete observed skidder phase cycles and actual payload throughput, not average phase duration or a generic travel-time estimate; no travel terrain, load capacity or operator safety inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "turnCycleTimesMinutes",
      label: "Turn cycle times minutes",
      kind: "numberList",
    },
    {
      id: "meanCycleTimeMinutes",
      label: "Mean cycle time minutes",
      kind: "number",
    },
    {
      id: "observedTurnPayloadThroughputM3PerHour",
      label: "Observed turn payload throughput m3 per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      cyclePhaseTimesMinutes:
        value.cyclePhaseTimesMinutes as readonly (readonly number[])[],
      turnPayloadVolumesM3: value.turnPayloadVolumesM3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
