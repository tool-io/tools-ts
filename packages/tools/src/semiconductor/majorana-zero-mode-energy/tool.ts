import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedSubgapEigenvaluesEv: readonly number[];
  readonly callerZeroModeEnergyToleranceEv: number;
}>;
export type Output = Readonly<{
  readonly observedClosestZeroEnergyEv: readonly number[];
  readonly closestAbsoluteSubgapEnergyEv: number;
  readonly withinCallerZeroEnergyTolerance: boolean;
}>;
const inputFields = [
  {
    id: "observedSubgapEigenvaluesEv",
    label: "Observed subgap eigenvalues ev",
    kind: "numberList",
  },
  {
    id: "callerZeroModeEnergyToleranceEv",
    label: "Caller zero mode energy tolerance ev",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerZeroModeEnergyToleranceEv,
    "callerZeroModeEnergyToleranceEv",
  );
  if (!input.observedSubgapEigenvaluesEv.length)
    simpleError(
      "spectrum",
      "Actual independently computed subgap eigenvalues required.",
    );
  const min = Math.min(...input.observedSubgapEigenvaluesEv.map(Math.abs));
  return {
    observedClosestZeroEnergyEv: input.observedSubgapEigenvaluesEv.filter(
      (v) => Math.abs(v) === min,
    ),
    closestAbsoluteSubgapEnergyEv: min,
    withinCallerZeroEnergyTolerance:
      min <= input.callerZeroModeEnergyToleranceEv,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSubgapEigenvaluesEv: [-0.01, 0.03, -0.01],
  callerZeroModeEnergyToleranceEv: 0.02,
} satisfies Input;
export const exampleOutput = {
  observedClosestZeroEnergyEv: [-0.01, -0.01],
  closestAbsoluteSubgapEnergyEv: 0.01,
  withinCallerZeroEnergyTolerance: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/majorana-zero-mode-energy",
  title: "Semiconductor Majorana Zero Mode Energy Calculator",
  description:
    "Locate actual subgap eigenvalues nearest zero with ties/residual tolerance; near-zero energy does not identify Majorana modes, prove topology or exclude ordinary bound states.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedClosestZeroEnergyEv",
      label: "Observed closest zero energy ev",
      kind: "numberList",
    },
    {
      id: "closestAbsoluteSubgapEnergyEv",
      label: "Closest absolute subgap energy ev",
      kind: "number",
    },
    {
      id: "withinCallerZeroEnergyTolerance",
      label: "Within caller zero energy tolerance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSubgapEigenvaluesEv:
        value.observedSubgapEigenvaluesEv as readonly number[],
      callerZeroModeEnergyToleranceEv:
        value.callerZeroModeEnergyToleranceEv as number,
    }),
});
export const run = tool.execute;
export default tool;
