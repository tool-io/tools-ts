import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  positive,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedNonnegativeBarValues: readonly number[];
  readonly plottedAxisMinimum: number;
  readonly plottedAxisMaximum: number;
}>;
export type Output = Readonly<{
  readonly axisExcludesZero: boolean;
  readonly plottedValuesOutsideAxisIndices: readonly number[];
  readonly apparentBarLengthFractions: readonly number[];
  readonly fractionalDifferenceRelativeToFirstValue: number;
  readonly fractionalDifferenceRelativeToFirstPlottedBarLength: number;
}>;
const inputFields = [
  {
    id: "observedNonnegativeBarValues",
    label: "Observed nonnegative bar values",
    kind: "numberList",
  },
  { id: "plottedAxisMinimum", label: "Plotted axis minimum", kind: "number" },
  { id: "plottedAxisMaximum", label: "Plotted axis maximum", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.plottedAxisMaximum, "plottedAxisMaximum");
  input.observedNonnegativeBarValues.forEach((v) =>
    nonnegative(v, "observedNonnegativeBarValues"),
  );
  nonnegative(input.plottedAxisMinimum, "plottedAxisMinimum");
  if (
    input.plottedAxisMaximum <= input.plottedAxisMinimum ||
    input.observedNonnegativeBarValues.length < 2
  )
    simpleError(
      "axis",
      "Ordered axis and at least two observed nonnegative bars required.",
    );
  const values = input.observedNonnegativeBarValues,
    first = values[0],
    a = first - input.plottedAxisMinimum;
  return {
    axisExcludesZero: input.plottedAxisMinimum > 0,
    plottedValuesOutsideAxisIndices: values.flatMap((v, i) =>
      v < input.plottedAxisMinimum || v > input.plottedAxisMaximum ? [i] : [],
    ),
    apparentBarLengthFractions: values.map(
      (v) =>
        (v - input.plottedAxisMinimum) /
        (input.plottedAxisMaximum - input.plottedAxisMinimum),
    ),
    fractionalDifferenceRelativeToFirstValue: first
      ? (values[1] - first) / first
      : -1,
    fractionalDifferenceRelativeToFirstPlottedBarLength:
      a > 0 ? (values[1] - first) / a : -1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNonnegativeBarValues: [90, 100],
  plottedAxisMinimum: 80,
  plottedAxisMaximum: 120,
} satisfies Input;
export const exampleOutput = {
  axisExcludesZero: true,
  plottedValuesOutsideAxisIndices: [],
  apparentBarLengthFractions: [0.25, 0.5],
  fractionalDifferenceRelativeToFirstValue: 0.1111111111111111,
  fractionalDifferenceRelativeToFirstPlottedBarLength: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/chart-axis-zero-truncated-bar-misleading-checker",
  title: "Chart Axis Zero Truncated Bar Misleading Checker",
  description:
    "Audit actual nonnegative bar values and plotted bounds, exposing zero exclusion and first-two apparent-versus-value relative difference; outside-axis values remain signed, unavailable ratios use −1. Flags do not prove deceptive intent or apply to all chart types.",
  inputs: inputFields,
  outputs: [
    { id: "axisExcludesZero", label: "Axis excludes zero", kind: "boolean" },
    {
      id: "plottedValuesOutsideAxisIndices",
      label: "Plotted values outside axis indices",
      kind: "numberList",
    },
    {
      id: "apparentBarLengthFractions",
      label: "Apparent bar length fractions",
      kind: "numberList",
    },
    {
      id: "fractionalDifferenceRelativeToFirstValue",
      label: "Fractional difference relative to first value",
      kind: "number",
    },
    {
      id: "fractionalDifferenceRelativeToFirstPlottedBarLength",
      label: "Fractional difference relative to first plotted bar length",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNonnegativeBarValues:
        value.observedNonnegativeBarValues as readonly number[],
      plottedAxisMinimum: value.plottedAxisMinimum as number,
      plottedAxisMaximum: value.plottedAxisMaximum as number,
    }),
});
export const run = tool.execute;
export default tool;
