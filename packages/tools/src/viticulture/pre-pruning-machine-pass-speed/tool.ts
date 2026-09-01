import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedRowLengthsM: readonly number[];
  readonly callerPassesPerRow: number;
  readonly measuredPrePrunerTravelMMinute: number;
  readonly callerTurnaroundMinutesPerPass: number;
}>;
export type Output = Readonly<{
  readonly plannedTotalPrePrunerTravelM: number;
  readonly plannedWholeRowPasses: number;
  readonly modeledPrePruningSessionMinutes: number;
}>;
const inputFields = [
  {
    id: "observedRowLengthsM",
    label: "Observed row lengths m",
    kind: "numberList",
  },
  { id: "callerPassesPerRow", label: "Caller passes per row", kind: "number" },
  {
    id: "measuredPrePrunerTravelMMinute",
    label: "Measured pre pruner travel m minute",
    kind: "number",
  },
  {
    id: "callerTurnaroundMinutesPerPass",
    label: "Caller turnaround minutes per pass",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedRowLengthsM.forEach((v) => positive(v, "observedRowLengthsM"));
  positive(
    input.measuredPrePrunerTravelMMinute,
    "measuredPrePrunerTravelMMinute",
  );
  nonnegative(
    input.callerTurnaroundMinutesPerPass,
    "callerTurnaroundMinutesPerPass",
  );
  if (!input.observedRowLengthsM.length)
    simpleError("rows", "Actual observed row lengths required.");
  bounded(input.callerPassesPerRow, "passes", 1, 100);
  const distance = sum(input.observedRowLengthsM) * input.callerPassesPerRow,
    passes = input.observedRowLengthsM.length * input.callerPassesPerRow;
  return {
    plannedTotalPrePrunerTravelM: distance,
    plannedWholeRowPasses: passes,
    modeledPrePruningSessionMinutes:
      distance / input.measuredPrePrunerTravelMMinute +
      passes * input.callerTurnaroundMinutesPerPass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRowLengthsM: [100, 200],
  callerPassesPerRow: 2,
  measuredPrePrunerTravelMMinute: 50,
  callerTurnaroundMinutesPerPass: 1,
} satisfies Input;
export const exampleOutput = {
  plannedTotalPrePrunerTravelM: 600,
  plannedWholeRowPasses: 4,
  modeledPrePruningSessionMinutes: 16,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/pre-pruning-machine-pass-speed",
  title: "Pre Pruning Machine Pass Speed Calculator",
  description:
    "Budget actual pre-pruner row/pass travel and caller end-turn time per pass at matched measured travel rate; not route coordinate transformation, optimal machine speed or equipment safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedTotalPrePrunerTravelM",
      label: "Planned total pre pruner travel m",
      kind: "number",
    },
    {
      id: "plannedWholeRowPasses",
      label: "Planned whole row passes",
      kind: "number",
    },
    {
      id: "modeledPrePruningSessionMinutes",
      label: "Modeled pre pruning session minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRowLengthsM: value.observedRowLengthsM as readonly number[],
      callerPassesPerRow: value.callerPassesPerRow as number,
      measuredPrePrunerTravelMMinute:
        value.measuredPrePrunerTravelMMinute as number,
      callerTurnaroundMinutesPerPass:
        value.callerTurnaroundMinutesPerPass as number,
    }),
});
export const run = tool.execute;
export default tool;
