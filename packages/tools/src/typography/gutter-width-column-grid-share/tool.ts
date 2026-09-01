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
  fraction,
  count,
  bounded,
} from "../shared.js";
export type Input = Readonly<{
  readonly fullGridWidthPx: number;
  readonly columnCount: number;
  readonly callerTotalGutterShare: number;
}>;
export type Output = Readonly<{
  readonly gutterCount: number;
  readonly eachGutterWidthPx: number;
  readonly eachColumnWidthPx: number;
}>;
const inputFields = [
  { id: "fullGridWidthPx", label: "Full grid width px", kind: "number" },
  { id: "columnCount", label: "Column count", kind: "number" },
  {
    id: "callerTotalGutterShare",
    label: "Caller total gutter share",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.fullGridWidthPx, "fullGridWidthPx");
  fraction(input.callerTotalGutterShare, "callerTotalGutterShare");
  count(input.columnCount, "columnCount");
  bounded(input.columnCount, "columns", 2, 128);
  if (input.callerTotalGutterShare === 1)
    simpleError("share", "Positive column share required.");
  return {
    gutterCount: input.columnCount - 1,
    eachGutterWidthPx:
      (input.fullGridWidthPx * input.callerTotalGutterShare) /
      (input.columnCount - 1),
    eachColumnWidthPx:
      (input.fullGridWidthPx * (1 - input.callerTotalGutterShare)) /
      input.columnCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  fullGridWidthPx: 600,
  columnCount: 3,
  callerTotalGutterShare: 0.1,
} satisfies Input;
export const exampleOutput = {
  gutterCount: 2,
  eachGutterWidthPx: 30,
  eachColumnWidthPx: 180,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/gutter-width-column-grid-share",
  title: "Gutter Width Column Grid Share",
  description:
    "Allocate explicit total gutter share among N−1 gutters separately from N equal columns; not a percent per gutter or universally recommended grid.",
  inputs: inputFields,
  outputs: [
    { id: "gutterCount", label: "Gutter count", kind: "number" },
    { id: "eachGutterWidthPx", label: "Each gutter width px", kind: "number" },
    { id: "eachColumnWidthPx", label: "Each column width px", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      fullGridWidthPx: value.fullGridWidthPx as number,
      columnCount: value.columnCount as number,
      callerTotalGutterShare: value.callerTotalGutterShare as number,
    }),
});
export const run = tool.execute;
export default tool;
