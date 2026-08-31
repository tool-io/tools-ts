import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedFieldMillitesla: readonly number[];
  readonly callerOperateMillitesla: number;
  readonly callerReleaseMillitesla: number;
  readonly initialSwitchActive: boolean;
}>;
export type Output = Readonly<{
  readonly modeledSwitchActiveFlags: readonly number[];
  readonly modeledOperateSampleIndices: readonly number[];
  readonly modeledReleaseSampleIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFieldMillitesla",
    label: "Observed field millitesla",
    kind: "numberList",
  },
  {
    id: "callerOperateMillitesla",
    label: "Caller operate millitesla",
    kind: "number",
  },
  {
    id: "callerReleaseMillitesla",
    label: "Caller release millitesla",
    kind: "number",
  },
  {
    id: "initialSwitchActive",
    label: "Initial switch active",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.callerReleaseMillitesla >= input.callerOperateMillitesla)
    simpleError(
      "thresholds",
      "Signed unipolar release must be below operate threshold; bipolar/latching devices unsupported.",
    );
  let active = input.initialSwitchActive;
  const operates: number[] = [],
    releases: number[] = [],
    flags = input.observedFieldMillitesla.map((v, i) => {
      const prior = active;
      if (active && v <= input.callerReleaseMillitesla) active = false;
      else if (!active && v >= input.callerOperateMillitesla) active = true;
      if (!prior && active) operates.push(i);
      if (prior && !active) releases.push(i);
      return active ? 1 : 0;
    });
  return {
    modeledSwitchActiveFlags: flags,
    modeledOperateSampleIndices: operates,
    modeledReleaseSampleIndices: releases,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFieldMillitesla: [0, 5, 3, 1],
  callerOperateMillitesla: 4,
  callerReleaseMillitesla: 2,
  initialSwitchActive: false,
} satisfies Input;
export const exampleOutput = {
  modeledSwitchActiveFlags: [0, 1, 1, 0],
  modeledOperateSampleIndices: [1],
  modeledReleaseSampleIndices: [3],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electronics/hall-sensor-switch-point",
  title: "Hall Sensor Switch Point Calculator",
  description:
    "Apply caller unipolar Hall Schmitt thresholds to actual ordered field samples with initial state and transition witnesses; unlike hysteresis-width scalar, tracks state. No bipolar-device inference or switch identification.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledSwitchActiveFlags",
      label: "Modeled switch active flags",
      kind: "numberList",
    },
    {
      id: "modeledOperateSampleIndices",
      label: "Modeled operate sample indices",
      kind: "numberList",
    },
    {
      id: "modeledReleaseSampleIndices",
      label: "Modeled release sample indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFieldMillitesla:
        value.observedFieldMillitesla as readonly number[],
      callerOperateMillitesla: value.callerOperateMillitesla as number,
      callerReleaseMillitesla: value.callerReleaseMillitesla as number,
      initialSwitchActive: value.initialSwitchActive as boolean,
    }),
});
export const run = tool.execute;
export default tool;
