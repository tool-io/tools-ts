import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  unique,
  strictlyIncreasing,
  sequence,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedAccumulatedHeatSumCelsiusDays: readonly number[];
  readonly observedDayOrdinals: readonly number[];
  readonly callerStageIds: readonly string[];
  readonly callerStageHeatThresholds: readonly number[];
}>;
export type Output = Readonly<{
  readonly firstObservedStageDayOrdinals: readonly number[];
  readonly stagesNotReachedInObservations: readonly string[];
}>;
const inputFields = [
  {
    id: "observedAccumulatedHeatSumCelsiusDays",
    label: "Observed accumulated heat sum celsius days",
    kind: "numberList",
  },
  {
    id: "observedDayOrdinals",
    label: "Observed day ordinals",
    kind: "numberList",
  },
  { id: "callerStageIds", label: "Caller stage ids", kind: "stringList" },
  {
    id: "callerStageHeatThresholds",
    label: "Caller stage heat thresholds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedAccumulatedHeatSumCelsiusDays.forEach((v) =>
    nonnegative(v, "observedAccumulatedHeatSumCelsiusDays"),
  );
  input.callerStageHeatThresholds.forEach((v) =>
    nonnegative(v, "callerStageHeatThresholds"),
  );
  aligned(
    input.observedAccumulatedHeatSumCelsiusDays,
    input.observedDayOrdinals,
    "observedAccumulatedHeatSumCelsiusDays",
  );
  aligned(
    input.callerStageIds,
    input.callerStageHeatThresholds,
    "callerStageIds",
  );
  sequence(input.observedAccumulatedHeatSumCelsiusDays, "heatSum");
  strictlyIncreasing(input.observedDayOrdinals, "days");
  input.observedDayOrdinals.forEach((v) => nonnegative(v, "days"));
  unique(input.callerStageIds, "stages");
  strictlyIncreasing(input.callerStageHeatThresholds, "thresholds", 1);
  const days = input.callerStageHeatThresholds.map((t) => {
    const i = input.observedAccumulatedHeatSumCelsiusDays.findIndex(
      (v) => v >= t,
    );
    return i < 0 ? -1 : input.observedDayOrdinals[i];
  });
  return {
    firstObservedStageDayOrdinals: days,
    stagesNotReachedInObservations: input.callerStageIds.filter(
      (_, i) => days[i] === -1,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAccumulatedHeatSumCelsiusDays: [0, 100, 200],
  observedDayOrdinals: [0, 10, 20],
  callerStageIds: ["a", "b", "c"],
  callerStageHeatThresholds: [50, 150, 250],
} satisfies Input;
export const exampleOutput = {
  firstObservedStageDayOrdinals: [10, 20, -1],
  stagesNotReachedInObservations: ["c"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/gdd-stage-threshold-lookup",
  title: "GDD Stage Threshold Lookup",
  description:
    "Audit actual observed heat-sum chronology against caller ordered stage thresholds, using first observed attainment and −1 censoring; does not duplicate GDD accumulation, interpolate phenology or establish biological stage.",
  inputs: inputFields,
  outputs: [
    {
      id: "firstObservedStageDayOrdinals",
      label: "First observed stage day ordinals",
      kind: "numberList",
    },
    {
      id: "stagesNotReachedInObservations",
      label: "Stages not reached in observations",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedAccumulatedHeatSumCelsiusDays:
        value.observedAccumulatedHeatSumCelsiusDays as readonly number[],
      observedDayOrdinals: value.observedDayOrdinals as readonly number[],
      callerStageIds: value.callerStageIds as readonly string[],
      callerStageHeatThresholds:
        value.callerStageHeatThresholds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
