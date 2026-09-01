import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  strictlyIncreasing,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerTestedInsulationThicknessMm: readonly number[];
  readonly callerMatchedObservedHeatLossWattsM: readonly number[];
  readonly callerMaximumAllowedHeatLossWattsM: number;
}>;
export type Output = Readonly<{
  readonly minimumObservedCompatibleInsulationThicknessMm: number;
  readonly callerHeatLossBudgetMetByObservedCandidate: boolean;
}>;
const inputFields = [
  {
    id: "callerTestedInsulationThicknessMm",
    label: "Caller tested insulation thickness mm",
    kind: "numberList",
  },
  {
    id: "callerMatchedObservedHeatLossWattsM",
    label: "Caller matched observed heat loss watts m",
    kind: "numberList",
  },
  {
    id: "callerMaximumAllowedHeatLossWattsM",
    label: "Caller maximum allowed heat loss watts m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerTestedInsulationThicknessMm.forEach((v) =>
    nonnegative(v, "callerTestedInsulationThicknessMm"),
  );
  input.callerMatchedObservedHeatLossWattsM.forEach((v) =>
    nonnegative(v, "callerMatchedObservedHeatLossWattsM"),
  );
  nonnegative(
    input.callerMaximumAllowedHeatLossWattsM,
    "callerMaximumAllowedHeatLossWattsM",
  );
  aligned(
    input.callerTestedInsulationThicknessMm,
    input.callerMatchedObservedHeatLossWattsM,
    "callerTestedInsulationThicknessMm",
  );
  strictlyIncreasing(input.callerTestedInsulationThicknessMm, "thickness", 1);
  const i = input.callerMatchedObservedHeatLossWattsM.findIndex(
    (v) => v <= input.callerMaximumAllowedHeatLossWattsM,
  );
  return {
    minimumObservedCompatibleInsulationThicknessMm:
      i < 0 ? -1 : input.callerTestedInsulationThicknessMm[i],
    callerHeatLossBudgetMetByObservedCandidate: i >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerTestedInsulationThicknessMm: [0, 10, 20],
  callerMatchedObservedHeatLossWattsM: [30, 20, 10],
  callerMaximumAllowedHeatLossWattsM: 15,
} satisfies Input;
export const exampleOutput = {
  minimumObservedCompatibleInsulationThicknessMm: 20,
  callerHeatLossBudgetMetByObservedCandidate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/pipe-insulation-thickness",
  title: "Plumbing Pipe Insulation Thickness Calculator",
  description:
    "Select minimum actually tested insulation thickness meeting caller matched-temperature heat-loss budget, no continuous extrapolation, universal thermal conductivity or installation approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumObservedCompatibleInsulationThicknessMm",
      label: "Minimum observed compatible insulation thickness mm",
      kind: "number",
    },
    {
      id: "callerHeatLossBudgetMetByObservedCandidate",
      label: "Caller heat loss budget met by observed candidate",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerTestedInsulationThicknessMm:
        value.callerTestedInsulationThicknessMm as readonly number[],
      callerMatchedObservedHeatLossWattsM:
        value.callerMatchedObservedHeatLossWattsM as readonly number[],
      callerMaximumAllowedHeatLossWattsM:
        value.callerMaximumAllowedHeatLossWattsM as number,
    }),
});
export const run = tool.execute;
export default tool;
