import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly explicitColumnCount: number;
  readonly callerAutoPlacedItemColumnSpans: readonly number[];
  readonly densePacking: boolean;
}>;
export type Output = Readonly<{
  readonly itemRowColumnStarts: readonly (readonly number[])[];
  readonly sourceOrderVisualInversion: boolean;
}>;
const inputFields = [
  { id: "explicitColumnCount", label: "Explicit column count", kind: "number" },
  {
    id: "callerAutoPlacedItemColumnSpans",
    label: "Caller auto placed item column spans",
    kind: "numberList",
  },
  { id: "densePacking", label: "Dense packing", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.explicitColumnCount, "columns", 1, 32);
  if (input.callerAutoPlacedItemColumnSpans.length > 128)
    simpleError(
      "items",
      "≤128 row-flow unit-row items with no explicit placements.",
    );
  input.callerAutoPlacedItemColumnSpans.forEach((v) =>
    bounded(v, "span", 1, input.explicitColumnCount),
  );
  const cells: boolean[][] = [],
    placed: number[][] = [];
  let cursor = 0;
  for (const span of input.callerAutoPlacedItemColumnSpans) {
    let pos = input.densePacking ? 0 : cursor;
    for (; ; pos++) {
      const row = Math.floor(pos / input.explicitColumnCount),
        col = pos % input.explicitColumnCount;
      if (col + span > input.explicitColumnCount) continue;
      const r =
        cells[row] ??
        (cells[row] = Array<boolean>(input.explicitColumnCount).fill(false));
      if (r.slice(col, col + span).every((v) => !v)) {
        for (let k = col; k < col + span; k++) r[k] = true;
        placed.push([row, col]);
        cursor = pos + span;
        break;
      }
    }
  }
  return {
    itemRowColumnStarts: placed,
    sourceOrderVisualInversion: placed.some(
      (v, i) =>
        i > 0 &&
        v[0] * input.explicitColumnCount + v[1] <
          placed[i - 1][0] * input.explicitColumnCount + placed[i - 1][1],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  explicitColumnCount: 3,
  callerAutoPlacedItemColumnSpans: [2, 2, 1],
  densePacking: true,
} satisfies Input;
export const exampleOutput = {
  itemRowColumnStarts: [
    [0, 0],
    [1, 0],
    [0, 2],
  ],
  sourceOrderVisualInversion: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/grid-auto-flow-dense-packing-note",
  title: "grid-auto-flow:dense Packing Note",
  description:
    "Bounded row-auto-placement simulation for unit-row items in fixed columns with optional dense backfill; reports visual inversion without changing DOM/tab order. Not general spanning grid placement. Explicit supplied computed/layout context only; not a browser cascade/layout engine or cross-browser guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "itemRowColumnStarts",
      label: "Item row column starts",
      kind: "matrix",
    },
    {
      id: "sourceOrderVisualInversion",
      label: "Source order visual inversion",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      explicitColumnCount: value.explicitColumnCount as number,
      callerAutoPlacedItemColumnSpans:
        value.callerAutoPlacedItemColumnSpans as readonly number[],
      densePacking: value.densePacking as boolean,
    }),
});
export const run = tool.execute;
export default tool;
