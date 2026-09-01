import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  peakStorage,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedCollectedRainLitersByDay: readonly number[];
  readonly callerWithdrawalLitersByDay: readonly number[];
  readonly callerDeadStorageLiters: number;
}>;
export type Output = Readonly<{
  readonly modeledPeakUsableTankInventoryLiters: number;
  readonly requiredTankVolumeIncludingDeadStorageLiters: number;
  readonly unservedWithdrawalLiters: number;
}>;
const inputFields = [
  {
    id: "observedCollectedRainLitersByDay",
    label: "Observed collected rain liters by day",
    kind: "numberList",
  },
  {
    id: "callerWithdrawalLitersByDay",
    label: "Caller withdrawal liters by day",
    kind: "numberList",
  },
  {
    id: "callerDeadStorageLiters",
    label: "Caller dead storage liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.callerDeadStorageLiters, "callerDeadStorageLiters");
  const result = peakStorage(
    input.observedCollectedRainLitersByDay.map(() => 1),
    input.observedCollectedRainLitersByDay,
    input.callerWithdrawalLitersByDay,
  );
  return {
    modeledPeakUsableTankInventoryLiters: result.peak,
    requiredTankVolumeIncludingDeadStorageLiters:
      result.peak + input.callerDeadStorageLiters,
    unservedWithdrawalLiters: result.overflow,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCollectedRainLitersByDay: [100, 0, 100],
  callerWithdrawalLitersByDay: [0, 50, 0],
  callerDeadStorageLiters: 20,
} satisfies Input;
export const exampleOutput = {
  modeledPeakUsableTankInventoryLiters: 150,
  requiredTankVolumeIncludingDeadStorageLiters: 170,
  unservedWithdrawalLiters: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/rainwater-harvesting-tank-size",
  title: "Plumbing Rainwater Harvesting Tank Size Calculator",
  description:
    "Route actual daily collected rain/withdrawal ledger from empty usable storage plus dead storage; not independent event roof-yield calculation, future weather guarantee or water quality approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledPeakUsableTankInventoryLiters",
      label: "Modeled peak usable tank inventory liters",
      kind: "number",
    },
    {
      id: "requiredTankVolumeIncludingDeadStorageLiters",
      label: "Required tank volume including dead storage liters",
      kind: "number",
    },
    {
      id: "unservedWithdrawalLiters",
      label: "Unserved withdrawal liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCollectedRainLitersByDay:
        value.observedCollectedRainLitersByDay as readonly number[],
      callerWithdrawalLitersByDay:
        value.callerWithdrawalLitersByDay as readonly number[],
      callerDeadStorageLiters: value.callerDeadStorageLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
