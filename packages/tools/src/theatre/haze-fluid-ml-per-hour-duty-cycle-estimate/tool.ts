import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  unionLength,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedEnabledIntervalsMinutes: readonly (readonly number[])[];
  readonly observationWindowMinutes: number;
  readonly measuredFluidUseMlPerEnabledMinute: number;
  readonly startingFluidInventoryMl: number;
}>;
export type Output = Readonly<{
  readonly unionEnabledMinutes: number;
  readonly modeledFluidUsedMl: number;
  readonly signedRemainingFluidMl: number;
  readonly enabledDutyFraction: number;
}>;
const inputFields = [
  {
    id: "observedEnabledIntervalsMinutes",
    label: "Observed enabled intervals minutes",
    kind: "matrix",
  },
  {
    id: "observationWindowMinutes",
    label: "Observation window minutes",
    kind: "number",
  },
  {
    id: "measuredFluidUseMlPerEnabledMinute",
    label: "Measured fluid use ml per enabled minute",
    kind: "number",
  },
  {
    id: "startingFluidInventoryMl",
    label: "Starting fluid inventory ml",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observationWindowMinutes, "observationWindowMinutes");
  nonnegative(
    input.measuredFluidUseMlPerEnabledMinute,
    "measuredFluidUseMlPerEnabledMinute",
  );
  nonnegative(input.startingFluidInventoryMl, "startingFluidInventoryMl");
  const enabled = unionLength(
      input.observedEnabledIntervalsMinutes,
      input.observationWindowMinutes,
    ),
    used = enabled * input.measuredFluidUseMlPerEnabledMinute;
  return {
    unionEnabledMinutes: enabled,
    modeledFluidUsedMl: used,
    signedRemainingFluidMl: input.startingFluidInventoryMl - used,
    enabledDutyFraction: enabled / input.observationWindowMinutes,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedEnabledIntervalsMinutes: [
    [0, 10],
    [5, 15],
  ],
  observationWindowMinutes: 60,
  measuredFluidUseMlPerEnabledMinute: 2,
  startingFluidInventoryMl: 100,
} satisfies Input;
export const exampleOutput = {
  unionEnabledMinutes: 15,
  modeledFluidUsedMl: 30,
  signedRemainingFluidMl: 70,
  enabledDutyFraction: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/haze-fluid-ml-per-hour-duty-cycle-estimate",
  title: "Haze Fluid ML Per Hour Duty Cycle Estimate Calculator",
  description:
    "Budget measured fluid use over union of actual enabled intervals without double-counting overlaps; no haze concentration/ventilation, approved fluid choice, respiratory exposure or fire-system permission.",
  inputs: inputFields,
  outputs: [
    {
      id: "unionEnabledMinutes",
      label: "Union enabled minutes",
      kind: "number",
    },
    {
      id: "modeledFluidUsedMl",
      label: "Modeled fluid used ml",
      kind: "number",
    },
    {
      id: "signedRemainingFluidMl",
      label: "Signed remaining fluid ml",
      kind: "number",
    },
    {
      id: "enabledDutyFraction",
      label: "Enabled duty fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedEnabledIntervalsMinutes:
        value.observedEnabledIntervalsMinutes as readonly (readonly number[])[],
      observationWindowMinutes: value.observationWindowMinutes as number,
      measuredFluidUseMlPerEnabledMinute:
        value.measuredFluidUseMlPerEnabledMinute as number,
      startingFluidInventoryMl: value.startingFluidInventoryMl as number,
    }),
});
export const run = tool.execute;
export default tool;
