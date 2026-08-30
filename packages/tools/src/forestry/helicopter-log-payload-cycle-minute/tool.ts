import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly callerAvailableExternalPayloadKg: number;
  readonly riggingMassKg: number;
  readonly logGreenDensityKgPerM3: number;
  readonly cycleTimeMinutes: number;
  readonly expectedOperatingMinutes: number;
}>;
export type Output = Readonly<{
  readonly modelWoodPayloadM3PerCycle: number;
  readonly completeCycleCount: number;
  readonly completeCycleWoodVolumeM3: number;
  readonly idealContinuousThroughputM3PerHour: number;
}>;
const inputFields = [
  {
    id: "callerAvailableExternalPayloadKg",
    label: "Caller available external payload kg",
    kind: "number",
  },
  { id: "riggingMassKg", label: "Rigging mass kg", kind: "number" },
  {
    id: "logGreenDensityKgPerM3",
    label: "Log green density kg per m3",
    kind: "number",
  },
  { id: "cycleTimeMinutes", label: "Cycle time minutes", kind: "number" },
  {
    id: "expectedOperatingMinutes",
    label: "Expected operating minutes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerAvailableExternalPayloadKg,
    "callerAvailableExternalPayloadKg",
  );
  positive(input.logGreenDensityKgPerM3, "logGreenDensityKgPerM3");
  positive(input.cycleTimeMinutes, "cycleTimeMinutes");
  nonnegative(input.riggingMassKg, "riggingMassKg");
  nonnegative(input.expectedOperatingMinutes, "expectedOperatingMinutes");
  const usable = nonnegative(
      input.callerAvailableExternalPayloadKg - input.riggingMassKg,
      "riggingMassKg",
    ),
    modelWoodPayloadM3PerCycle = usable / input.logGreenDensityKgPerM3,
    completeCycleCount = Math.floor(
      input.expectedOperatingMinutes / input.cycleTimeMinutes,
    );
  count(completeCycleCount, "completeCycles");
  return {
    modelWoodPayloadM3PerCycle,
    completeCycleCount,
    completeCycleWoodVolumeM3: completeCycleCount * modelWoodPayloadM3PerCycle,
    idealContinuousThroughputM3PerHour:
      (60 * modelWoodPayloadM3PerCycle) / input.cycleTimeMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAvailableExternalPayloadKg: 1000,
  riggingMassKg: 100,
  logGreenDensityKgPerM3: 500,
  cycleTimeMinutes: 3,
  expectedOperatingMinutes: 10,
} satisfies Input;
export const exampleOutput = {
  modelWoodPayloadM3PerCycle: 1.8,
  completeCycleCount: 3,
  completeCycleWoodVolumeM3: 5.4,
  idealContinuousThroughputM3PerHour: 36,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/helicopter-log-payload-cycle-minute",
  title: "Helicopter Log Payload Cycle Minute",
  description:
    "Screen complete log-haul cycles from caller already-established available payload, rigging, green density and cycle duration; does not compute aircraft performance, approve lifts or certify external-load safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelWoodPayloadM3PerCycle",
      label: "Model wood payload m3 per cycle",
      kind: "number",
    },
    { id: "completeCycleCount", label: "Complete cycle count", kind: "number" },
    {
      id: "completeCycleWoodVolumeM3",
      label: "Complete cycle wood volume m3",
      kind: "number",
    },
    {
      id: "idealContinuousThroughputM3PerHour",
      label: "Ideal continuous throughput m3 per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAvailableExternalPayloadKg:
        value.callerAvailableExternalPayloadKg as number,
      riggingMassKg: value.riggingMassKg as number,
      logGreenDensityKgPerM3: value.logGreenDensityKgPerM3 as number,
      cycleTimeMinutes: value.cycleTimeMinutes as number,
      expectedOperatingMinutes: value.expectedOperatingMinutes as number,
    }),
});
export const run = tool.execute;
export default tool;
