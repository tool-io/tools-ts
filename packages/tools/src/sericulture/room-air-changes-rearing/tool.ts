import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly roomVolumeM3: number;
  readonly fanFlowsM3PerHour: readonly number[];
  readonly fanDutyFractions: readonly number[];
  readonly freshAirFractions: readonly number[];
  readonly mixingEfficiencyFraction: number;
  readonly targetRemainingTracerFraction: number;
}>;
export type Output = Readonly<{
  readonly effectiveFreshAirM3PerHour: number;
  readonly effectiveAirChangesPerHour: number;
  readonly modelTracerDecayMinutes: number;
}>;
const inputFields = [
  { id: "roomVolumeM3", label: "Room volume m3", kind: "number" },
  {
    id: "fanFlowsM3PerHour",
    label: "Fan flows m3 per hour",
    kind: "numberList",
  },
  { id: "fanDutyFractions", label: "Fan duty fractions", kind: "numberList" },
  { id: "freshAirFractions", label: "Fresh air fractions", kind: "numberList" },
  {
    id: "mixingEfficiencyFraction",
    label: "Mixing efficiency fraction",
    kind: "number",
  },
  {
    id: "targetRemainingTracerFraction",
    label: "Target remaining tracer fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.roomVolumeM3, "roomVolumeM3");
  positive(
    input.targetRemainingTracerFraction,
    "targetRemainingTracerFraction",
  );
  input.fanFlowsM3PerHour.forEach((v) => nonnegative(v, "fanFlowsM3PerHour"));
  input.fanDutyFractions.forEach((v) => fraction(v, "fanDutyFractions"));
  input.freshAirFractions.forEach((v) => fraction(v, "freshAirFractions"));
  fraction(input.mixingEfficiencyFraction, "mixingEfficiencyFraction");
  fraction(
    input.targetRemainingTracerFraction,
    "targetRemainingTracerFraction",
  );
  aligned(input.fanFlowsM3PerHour, input.fanDutyFractions, "fanFlowsM3PerHour");
  aligned(
    input.fanFlowsM3PerHour,
    input.freshAirFractions,
    "fanFlowsM3PerHour",
  );
  const effectiveFreshAirM3PerHour = positive(
      input.fanFlowsM3PerHour.reduce(
        (s, v, i) =>
          s + v * input.fanDutyFractions[i] * input.freshAirFractions[i],
        0,
      ) * input.mixingEfficiencyFraction,
      "freshAir",
    ),
    effectiveAirChangesPerHour =
      effectiveFreshAirM3PerHour / input.roomVolumeM3;
  return {
    effectiveFreshAirM3PerHour,
    effectiveAirChangesPerHour,
    modelTracerDecayMinutes:
      (-Math.log(input.targetRemainingTracerFraction) /
        effectiveAirChangesPerHour) *
      60,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  roomVolumeM3: 100,
  fanFlowsM3PerHour: [300, 200],
  fanDutyFractions: [1, 0.5],
  freshAirFractions: [0.5, 1],
  mixingEfficiencyFraction: 0.8,
  targetRemainingTracerFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  effectiveFreshAirM3PerHour: 200,
  effectiveAirChangesPerHour: 2,
  modelTracerDecayMinutes: 69.07755278982138,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sericulture/room-air-changes-rearing",
  title: "Room Air Changes Rearing",
  description:
    "Compute effective fresh-air changes and source-free mixed tracer decay from fan duty, recirculation and mixing calibration; unlike mining steady contaminant dilution, no generation-limit airflow or disease-control guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "effectiveFreshAirM3PerHour",
      label: "Effective fresh air m3 per hour",
      kind: "number",
    },
    {
      id: "effectiveAirChangesPerHour",
      label: "Effective air changes per hour",
      kind: "number",
    },
    {
      id: "modelTracerDecayMinutes",
      label: "Model tracer decay minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      roomVolumeM3: value.roomVolumeM3 as number,
      fanFlowsM3PerHour: value.fanFlowsM3PerHour as readonly number[],
      fanDutyFractions: value.fanDutyFractions as readonly number[],
      freshAirFractions: value.freshAirFractions as readonly number[],
      mixingEfficiencyFraction: value.mixingEfficiencyFraction as number,
      targetRemainingTracerFraction:
        value.targetRemainingTracerFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
