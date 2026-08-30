import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  count,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedPruningWeightKgPerVine: readonly number[];
  readonly callerFirstWeightAllowanceKg: number;
  readonly callerBaseBudAllowance: number;
  readonly callerExtraBudsPerAdditionalKg: number;
  readonly callerMaximumNodeLoad: number;
}>;
export type Output = Readonly<{
  readonly uncappedCallerNodeLoads: readonly number[];
  readonly cappedCallerNodeLoads: readonly number[];
  readonly callerLoadCapAppliedFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "observedPruningWeightKgPerVine",
    label: "Observed pruning weight kg per vine",
    kind: "numberList",
  },
  {
    id: "callerFirstWeightAllowanceKg",
    label: "Caller first weight allowance kg",
    kind: "number",
  },
  {
    id: "callerBaseBudAllowance",
    label: "Caller base bud allowance",
    kind: "integer",
  },
  {
    id: "callerExtraBudsPerAdditionalKg",
    label: "Caller extra buds per additional kg",
    kind: "number",
  },
  {
    id: "callerMaximumNodeLoad",
    label: "Caller maximum node load",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedPruningWeightKgPerVine.forEach((v) =>
    nonnegative(v, "observedPruningWeightKgPerVine"),
  );
  nonnegative(
    input.callerFirstWeightAllowanceKg,
    "callerFirstWeightAllowanceKg",
  );
  nonnegative(
    input.callerExtraBudsPerAdditionalKg,
    "callerExtraBudsPerAdditionalKg",
  );
  count(input.callerBaseBudAllowance, "callerBaseBudAllowance");
  count(input.callerMaximumNodeLoad, "callerMaximumNodeLoad");
  const uncappedCallerNodeLoads = input.observedPruningWeightKgPerVine.map(
      (v) =>
        input.callerBaseBudAllowance +
        safeCeil(
          Math.max(0, v - input.callerFirstWeightAllowanceKg) *
            input.callerExtraBudsPerAdditionalKg,
          "extraBuds",
        ),
    ),
    cappedCallerNodeLoads = uncappedCallerNodeLoads.map((v) =>
      Math.min(v, input.callerMaximumNodeLoad),
    );
  uncappedCallerNodeLoads.forEach((v) => count(v, "uncappedNodeLoad"));
  return {
    uncappedCallerNodeLoads,
    cappedCallerNodeLoads,
    callerLoadCapAppliedFlags: uncappedCallerNodeLoads.map((v) =>
      v > input.callerMaximumNodeLoad ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPruningWeightKgPerVine: [1, 2],
  callerFirstWeightAllowanceKg: 1,
  callerBaseBudAllowance: 20,
  callerExtraBudsPerAdditionalKg: 10,
  callerMaximumNodeLoad: 25,
} satisfies Input;
export const exampleOutput = {
  uncappedCallerNodeLoads: [20, 30],
  cappedCallerNodeLoads: [20, 25],
  callerLoadCapAppliedFlags: [0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/node-loading-adjustment-target",
  title: "Node Loading Adjustment Target",
  description:
    "Apply explicitly supplied balanced-pruning node allowance/extra-weight/cap policy and retain uncapped demand/cap flags; not a universal variety rule, crop forecast or pruning recommendation.",
  inputs: inputFields,
  outputs: [
    {
      id: "uncappedCallerNodeLoads",
      label: "Uncapped caller node loads",
      kind: "numberList",
    },
    {
      id: "cappedCallerNodeLoads",
      label: "Capped caller node loads",
      kind: "numberList",
    },
    {
      id: "callerLoadCapAppliedFlags",
      label: "Caller load cap applied flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPruningWeightKgPerVine:
        value.observedPruningWeightKgPerVine as readonly number[],
      callerFirstWeightAllowanceKg:
        value.callerFirstWeightAllowanceKg as number,
      callerBaseBudAllowance: value.callerBaseBudAllowance as number,
      callerExtraBudsPerAdditionalKg:
        value.callerExtraBudsPerAdditionalKg as number,
      callerMaximumNodeLoad: value.callerMaximumNodeLoad as number,
    }),
});
export const run = tool.execute;
export default tool;
