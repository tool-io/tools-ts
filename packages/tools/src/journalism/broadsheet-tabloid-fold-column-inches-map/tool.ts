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
  aligned,
  sum,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly columnWidthsInches: readonly number[];
  readonly columnTopDepthsInches: readonly number[];
  readonly columnBottomDepthsInches: readonly number[];
  readonly pageFoldDepthInches: number;
}>;
export type Output = Readonly<{
  readonly columnInchesAboveFold: readonly number[];
  readonly columnInchesBelowFold: readonly number[];
  readonly totalColumnInchesAboveFold: number;
  readonly totalColumnInchesBelowFold: number;
}>;
const inputFields = [
  {
    id: "columnWidthsInches",
    label: "Column widths inches",
    kind: "numberList",
  },
  {
    id: "columnTopDepthsInches",
    label: "Column top depths inches",
    kind: "numberList",
  },
  {
    id: "columnBottomDepthsInches",
    label: "Column bottom depths inches",
    kind: "numberList",
  },
  {
    id: "pageFoldDepthInches",
    label: "Page fold depth inches",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.columnWidthsInches.forEach((v) => positive(v, "columnWidthsInches"));
  input.columnTopDepthsInches.forEach((v) =>
    nonnegative(v, "columnTopDepthsInches"),
  );
  input.columnBottomDepthsInches.forEach((v) =>
    nonnegative(v, "columnBottomDepthsInches"),
  );
  nonnegative(input.pageFoldDepthInches, "pageFoldDepthInches");
  aligned(
    input.columnWidthsInches,
    input.columnTopDepthsInches,
    "columnWidthsInches",
  );
  aligned(
    input.columnWidthsInches,
    input.columnBottomDepthsInches,
    "columnWidthsInches",
  );
  const above: number[] = [],
    below: number[] = [];
  input.columnWidthsInches.forEach((w, i) => {
    const top = input.columnTopDepthsInches[i],
      bottom = input.columnBottomDepthsInches[i];
    if (bottom < top)
      simpleError("column", "Column bottom must not precede top.");
    above.push(
      w * Math.max(0, Math.min(bottom, input.pageFoldDepthInches) - top),
    );
    below.push(
      w * Math.max(0, bottom - Math.max(top, input.pageFoldDepthInches)),
    );
  });
  return {
    columnInchesAboveFold: above,
    columnInchesBelowFold: below,
    totalColumnInchesAboveFold: sum(above),
    totalColumnInchesBelowFold: sum(below),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  columnWidthsInches: [2, 3],
  columnTopDepthsInches: [1, 4],
  columnBottomDepthsInches: [5, 8],
  pageFoldDepthInches: 6,
} satisfies Input;
export const exampleOutput = {
  columnInchesAboveFold: [8, 6],
  columnInchesBelowFold: [0, 6],
  totalColumnInchesAboveFold: 14,
  totalColumnInchesBelowFold: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/broadsheet-tabloid-fold-column-inches-map",
  title: "Broadsheet Tabloid Fold Column Inches Map",
  description:
    "Map actual text-column rectangular area above/below explicit page fold in square inches (traditional width-scaled column-inches); caller defines nonoverlapping column geometry, no paper-format/fold universal constant.",
  inputs: inputFields,
  outputs: [
    {
      id: "columnInchesAboveFold",
      label: "Column inches above fold",
      kind: "numberList",
    },
    {
      id: "columnInchesBelowFold",
      label: "Column inches below fold",
      kind: "numberList",
    },
    {
      id: "totalColumnInchesAboveFold",
      label: "Total column inches above fold",
      kind: "number",
    },
    {
      id: "totalColumnInchesBelowFold",
      label: "Total column inches below fold",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      columnWidthsInches: value.columnWidthsInches as readonly number[],
      columnTopDepthsInches: value.columnTopDepthsInches as readonly number[],
      columnBottomDepthsInches:
        value.columnBottomDepthsInches as readonly number[],
      pageFoldDepthInches: value.pageFoldDepthInches as number,
    }),
});
export const run = tool.execute;
export default tool;
