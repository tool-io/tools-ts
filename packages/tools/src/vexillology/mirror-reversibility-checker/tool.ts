import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  shape,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly obversePaletteGrid: readonly (readonly number[])[];
  readonly reversePaletteGrid: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "obversePaletteGrid", label: "Obverse palette grid", kind: "matrix" },
  { id: "reversePaletteGrid", label: "Reverse palette grid", kind: "matrix" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const w = shape(input.obversePaletteGrid, "obverse");
  if (
    shape(input.reversePaletteGrid, "reverse") !== w ||
    input.reversePaletteGrid.length !== input.obversePaletteGrid.length
  )
    simpleError("grids", "Same registered palette grid dimensions.");
  [...input.obversePaletteGrid, ...input.reversePaletteGrid].forEach((r) =>
    r.forEach((v) => bounded(v, "paletteID", 0, 1000000)),
  );
  const cells: number[][] = [];
  input.obversePaletteGrid.forEach((r, y) =>
    r.forEach((v, x) => {
      if (v !== input.reversePaletteGrid[y][w - 1 - x]) cells.push([y, x]);
    }),
  );
  return {
    reverseEqualsHorizontalMirror: !cells.length,
    mismatchedMirrorCells: cells,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    obversePaletteGrid: [
      [1, 2],
      [3, 4],
    ],
    reversePaletteGrid: [
      [2, 1],
      [4, 3],
    ],
  },
  output: {
    result: { reverseEqualsHorizontalMirror: true, mismatchedMirrorCells: [] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/mirror-reversibility-checker",
  title: "Mirror Reversibility Obverse-Reverse Checker",
  description:
    "Compare exact registered palette-ID grids with horizontal obverse reversal; assumes both views have same top and hoist-side registration, not image resampling or print reversibility certification.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
