import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedWashProgramLiters: readonly number[];
  readonly observedWashProgramCycleCounts: readonly number[];
  readonly observedLaundryMassKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedWashLitersByProgram: readonly number[];
  readonly totalObservedLaundryLiters: number;
  readonly pooledLaundryLitersPerKg: number;
}>;
const inputFields = [
  {
    id: "observedWashProgramLiters",
    label: "Observed wash program liters",
    kind: "numberList",
  },
  {
    id: "observedWashProgramCycleCounts",
    label: "Observed wash program cycle counts",
    kind: "numberList",
  },
  {
    id: "observedLaundryMassKg",
    label: "Observed laundry mass kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLaundryMassKg.forEach((v) =>
    positive(v, "observedLaundryMassKg"),
  );
  input.observedWashProgramLiters.forEach((v) =>
    nonnegative(v, "observedWashProgramLiters"),
  );
  aligned(
    input.observedWashProgramLiters,
    input.observedWashProgramCycleCounts,
    "observedWashProgramLiters",
  );
  aligned(
    input.observedWashProgramLiters,
    input.observedLaundryMassKg,
    "observedWashProgramLiters",
  );
  input.observedWashProgramCycleCounts.forEach((v) =>
    bounded(v, "cycles", 0, 1000000),
  );
  const volumes = input.observedWashProgramLiters.map(
      (v, i) => v * input.observedWashProgramCycleCounts[i],
    ),
    total = sum(volumes);
  return {
    observedWashLitersByProgram: volumes,
    totalObservedLaundryLiters: total,
    pooledLaundryLitersPerKg: total / sum(input.observedLaundryMassKg),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWashProgramLiters: [40, 60],
  observedWashProgramCycleCounts: [2, 1],
  observedLaundryMassKg: [10, 5],
} satisfies Input;
export const exampleOutput = {
  observedWashLitersByProgram: [80, 60],
  totalObservedLaundryLiters: 140,
  pooledLaundryLitersPerKg: 9.333333333333334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/washing-machine-water-usage",
  title: "Plumbing Washing Machine Water Usage Calculator",
  description:
    "Reconcile actual wash-program water/cycle inventory and independently total represented laundry mass per program, not universal appliance liters/cycle.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedWashLitersByProgram",
      label: "Observed wash liters by program",
      kind: "numberList",
    },
    {
      id: "totalObservedLaundryLiters",
      label: "Total observed laundry liters",
      kind: "number",
    },
    {
      id: "pooledLaundryLitersPerKg",
      label: "Pooled laundry liters per kg",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedWashProgramLiters:
        value.observedWashProgramLiters as readonly number[],
      observedWashProgramCycleCounts:
        value.observedWashProgramCycleCounts as readonly number[],
      observedLaundryMassKg: value.observedLaundryMassKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
