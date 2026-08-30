import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly nozzleCollectedVolumesLiters: readonly number[];
  readonly collectionDurationsMinutes: readonly number[];
  readonly callerTargetApplicationLitersPerHa: number;
  readonly travelSpeedKmPerHour: number;
  readonly nozzleSpacingM: number;
  readonly callerRelativeFlowTolerance: number;
}>;
export type Output = Readonly<{
  readonly measuredNozzleFlowsLitersPerMinute: readonly number[];
  readonly targetNozzleFlowLitersPerMinute: number;
  readonly relativeTargetFlowErrors: readonly number[];
  readonly outsideCallerFlowToleranceFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "nozzleCollectedVolumesLiters",
    label: "Nozzle collected volumes liters",
    kind: "numberList",
  },
  {
    id: "collectionDurationsMinutes",
    label: "Collection durations minutes",
    kind: "numberList",
  },
  {
    id: "callerTargetApplicationLitersPerHa",
    label: "Caller target application liters per ha",
    kind: "number",
  },
  {
    id: "travelSpeedKmPerHour",
    label: "Travel speed km per hour",
    kind: "number",
  },
  { id: "nozzleSpacingM", label: "Nozzle spacing m", kind: "number" },
  {
    id: "callerRelativeFlowTolerance",
    label: "Caller relative flow tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.collectionDurationsMinutes.forEach((v) =>
    positive(v, "collectionDurationsMinutes"),
  );
  positive(
    input.callerTargetApplicationLitersPerHa,
    "callerTargetApplicationLitersPerHa",
  );
  positive(input.travelSpeedKmPerHour, "travelSpeedKmPerHour");
  positive(input.nozzleSpacingM, "nozzleSpacingM");
  input.nozzleCollectedVolumesLiters.forEach((v) =>
    nonnegative(v, "nozzleCollectedVolumesLiters"),
  );
  nonnegative(input.callerRelativeFlowTolerance, "callerRelativeFlowTolerance");
  aligned(
    input.nozzleCollectedVolumesLiters,
    input.collectionDurationsMinutes,
    "nozzleCollectedVolumesLiters",
  );
  const targetNozzleFlowLitersPerMinute =
      (input.callerTargetApplicationLitersPerHa *
        input.travelSpeedKmPerHour *
        input.nozzleSpacingM) /
      600,
    measuredNozzleFlowsLitersPerMinute = input.nozzleCollectedVolumesLiters.map(
      (v, i) => v / input.collectionDurationsMinutes[i],
    ),
    relativeTargetFlowErrors = measuredNozzleFlowsLitersPerMinute.map(
      (v) => v / targetNozzleFlowLitersPerMinute - 1,
    );
  return {
    measuredNozzleFlowsLitersPerMinute,
    targetNozzleFlowLitersPerMinute,
    relativeTargetFlowErrors,
    outsideCallerFlowToleranceFlags: relativeTargetFlowErrors.map((v) =>
      Math.abs(v) > input.callerRelativeFlowTolerance ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  nozzleCollectedVolumesLiters: [1, 2],
  collectionDurationsMinutes: [1, 1],
  callerTargetApplicationLitersPerHa: 200,
  travelSpeedKmPerHour: 6,
  nozzleSpacingM: 0.5,
  callerRelativeFlowTolerance: 0.1,
} satisfies Input;
export const exampleOutput = {
  measuredNozzleFlowsLitersPerMinute: [1, 2],
  targetNozzleFlowLitersPerMinute: 1,
  relativeTargetFlowErrors: [0, 1],
  outsideCallerFlowToleranceFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/spray-calibration-nozzle-flow",
  title: "Agriculture Spray Calibration Nozzle Flow",
  description:
    "Compare actual nozzle catch flow to caller-target liquid application, speed and nozzle spacing, retaining signed deviation; target is supplied and no pesticide dose, label compliance, drift or operator safety is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "measuredNozzleFlowsLitersPerMinute",
      label: "Measured nozzle flows liters per minute",
      kind: "numberList",
    },
    {
      id: "targetNozzleFlowLitersPerMinute",
      label: "Target nozzle flow liters per minute",
      kind: "number",
    },
    {
      id: "relativeTargetFlowErrors",
      label: "Relative target flow errors",
      kind: "numberList",
    },
    {
      id: "outsideCallerFlowToleranceFlags",
      label: "Outside caller flow tolerance flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      nozzleCollectedVolumesLiters:
        value.nozzleCollectedVolumesLiters as readonly number[],
      collectionDurationsMinutes:
        value.collectionDurationsMinutes as readonly number[],
      callerTargetApplicationLitersPerHa:
        value.callerTargetApplicationLitersPerHa as number,
      travelSpeedKmPerHour: value.travelSpeedKmPerHour as number,
      nozzleSpacingM: value.nozzleSpacingM as number,
      callerRelativeFlowTolerance: value.callerRelativeFlowTolerance as number,
    }),
});
export const run = tool.execute;
export default tool;
