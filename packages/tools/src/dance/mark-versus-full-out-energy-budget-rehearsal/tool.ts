import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  sum,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly observedRunDurationsMinutes: readonly number[];
  readonly callerMarkedOrFullOutCodes: readonly number[];
  readonly callerMeasuredMarkEffortUnitsPerMinute: number;
  readonly callerMeasuredFullEffortUnitsPerMinute: number;
  readonly callerEffortUnitBudget: number;
}>;
export type Output = Readonly<{
  readonly markedRunEffortUnits: number;
  readonly fullOutRunEffortUnits: number;
  readonly totalModeledEffortUnits: number;
  readonly signedEffortBudgetMarginUnits: number;
}>;
const inputFields = [
  {
    id: "observedRunDurationsMinutes",
    label: "Observed run durations minutes",
    kind: "numberList",
  },
  {
    id: "callerMarkedOrFullOutCodes",
    label: "Caller marked or full out codes",
    kind: "numberList",
  },
  {
    id: "callerMeasuredMarkEffortUnitsPerMinute",
    label: "Caller measured mark effort units per minute",
    kind: "number",
  },
  {
    id: "callerMeasuredFullEffortUnitsPerMinute",
    label: "Caller measured full effort units per minute",
    kind: "number",
  },
  {
    id: "callerEffortUnitBudget",
    label: "Caller effort unit budget",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRunDurationsMinutes.forEach((v) =>
    nonnegative(v, "observedRunDurationsMinutes"),
  );
  nonnegative(
    input.callerMeasuredMarkEffortUnitsPerMinute,
    "callerMeasuredMarkEffortUnitsPerMinute",
  );
  nonnegative(
    input.callerMeasuredFullEffortUnitsPerMinute,
    "callerMeasuredFullEffortUnitsPerMinute",
  );
  nonnegative(input.callerEffortUnitBudget, "callerEffortUnitBudget");
  aligned(
    input.observedRunDurationsMinutes,
    input.callerMarkedOrFullOutCodes,
    "observedRunDurationsMinutes",
  );
  binary(input.callerMarkedOrFullOutCodes, "runMode");
  const mark =
      sum(
        input.observedRunDurationsMinutes.filter(
          (_, i) => input.callerMarkedOrFullOutCodes[i] === 0,
        ),
      ) * input.callerMeasuredMarkEffortUnitsPerMinute,
    full =
      sum(
        input.observedRunDurationsMinutes.filter(
          (_, i) => input.callerMarkedOrFullOutCodes[i] === 1,
        ),
      ) * input.callerMeasuredFullEffortUnitsPerMinute;
  return {
    markedRunEffortUnits: mark,
    fullOutRunEffortUnits: full,
    totalModeledEffortUnits: mark + full,
    signedEffortBudgetMarginUnits: input.callerEffortUnitBudget - mark - full,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRunDurationsMinutes: [10, 10, 5],
  callerMarkedOrFullOutCodes: [0, 1, 0],
  callerMeasuredMarkEffortUnitsPerMinute: 1,
  callerMeasuredFullEffortUnitsPerMinute: 3,
  callerEffortUnitBudget: 40,
} satisfies Input;
export const exampleOutput = {
  markedRunEffortUnits: 15,
  fullOutRunEffortUnits: 30,
  totalModeledEffortUnits: 45,
  signedEffortBudgetMarginUnits: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/mark-versus-full-out-energy-budget-rehearsal",
  title: "Mark Versus Full Out Energy Budget Rehearsal",
  description:
    "Reconcile actual marked/full-out duration ledger with independently calibrated additive caller effort units; no default calories/METs, recovery model, fatigue threshold or safe load clearance.",
  inputs: inputFields,
  outputs: [
    {
      id: "markedRunEffortUnits",
      label: "Marked run effort units",
      kind: "number",
    },
    {
      id: "fullOutRunEffortUnits",
      label: "Full out run effort units",
      kind: "number",
    },
    {
      id: "totalModeledEffortUnits",
      label: "Total modeled effort units",
      kind: "number",
    },
    {
      id: "signedEffortBudgetMarginUnits",
      label: "Signed effort budget margin units",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRunDurationsMinutes:
        value.observedRunDurationsMinutes as readonly number[],
      callerMarkedOrFullOutCodes:
        value.callerMarkedOrFullOutCodes as readonly number[],
      callerMeasuredMarkEffortUnitsPerMinute:
        value.callerMeasuredMarkEffortUnitsPerMinute as number,
      callerMeasuredFullEffortUnitsPerMinute:
        value.callerMeasuredFullEffortUnitsPerMinute as number,
      callerEffortUnitBudget: value.callerEffortUnitBudget as number,
    }),
});
export const run = tool.execute;
export default tool;
