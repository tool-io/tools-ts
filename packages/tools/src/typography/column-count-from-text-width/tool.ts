import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly usableTextWidthPx: number;
  readonly callerMinimumColumnWidthPx: number;
  readonly gutterPx: number;
}>;
export type Output = Readonly<{
  readonly maximumWholeColumns: number;
  readonly resolvedEqualColumnWidthPx: number;
  readonly unusedWidthBelowMinimumColumnPx: number;
}>;
const inputFields = [
  { id: "usableTextWidthPx", label: "Usable text width px", kind: "number" },
  {
    id: "callerMinimumColumnWidthPx",
    label: "Caller minimum column width px",
    kind: "number",
  },
  { id: "gutterPx", label: "Gutter px", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMinimumColumnWidthPx, "callerMinimumColumnWidthPx");
  nonnegative(input.usableTextWidthPx, "usableTextWidthPx");
  nonnegative(input.gutterPx, "gutterPx");
  const n = count(
      Math.floor(
        (input.usableTextWidthPx + input.gutterPx) /
          (input.callerMinimumColumnWidthPx + input.gutterPx),
      ),
      "columns",
    ),
    usable = input.usableTextWidthPx - Math.max(0, n - 1) * input.gutterPx;
  return {
    maximumWholeColumns: n,
    resolvedEqualColumnWidthPx: n ? usable / n : 0,
    unusedWidthBelowMinimumColumnPx: n
      ? usable - n * input.callerMinimumColumnWidthPx
      : input.usableTextWidthPx,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  usableTextWidthPx: 650,
  callerMinimumColumnWidthPx: 200,
  gutterPx: 20,
} satisfies Input;
export const exampleOutput = {
  maximumWholeColumns: 3,
  resolvedEqualColumnWidthPx: 203.33333333333334,
  unusedWidthBelowMinimumColumnPx: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/column-count-from-text-width",
  title: "Column Count From Text Width",
  description:
    "Pack complete equal-width columns using N−1 gutters, with caller minimum measure; differs from measuring a single ch-based column, zero columns is explicit.",
  inputs: inputFields,
  outputs: [
    {
      id: "maximumWholeColumns",
      label: "Maximum whole columns",
      kind: "number",
    },
    {
      id: "resolvedEqualColumnWidthPx",
      label: "Resolved equal column width px",
      kind: "number",
    },
    {
      id: "unusedWidthBelowMinimumColumnPx",
      label: "Unused width below minimum column px",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      usableTextWidthPx: value.usableTextWidthPx as number,
      callerMinimumColumnWidthPx: value.callerMinimumColumnWidthPx as number,
      gutterPx: value.gutterPx as number,
    }),
});
export const run = tool.execute;
export default tool;
