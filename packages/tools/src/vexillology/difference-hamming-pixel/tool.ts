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
  readonly firstRegisteredPaletteGrid: readonly (readonly number[])[];
  readonly secondRegisteredPaletteGrid: readonly (readonly number[])[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "firstRegisteredPaletteGrid",
    label: "First registered palette grid",
    kind: "matrix",
  },
  {
    id: "secondRegisteredPaletteGrid",
    label: "Second registered palette grid",
    kind: "matrix",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const w = shape(input.firstRegisteredPaletteGrid, "first");
  if (
    shape(input.secondRegisteredPaletteGrid, "second") !== w ||
    input.firstRegisteredPaletteGrid.length !==
      input.secondRegisteredPaletteGrid.length
  )
    simpleError("grids", "Registered identical palette-grid dimensions.");
  [
    ...input.firstRegisteredPaletteGrid,
    ...input.secondRegisteredPaletteGrid,
  ].forEach((r) => r.forEach((v) => bounded(v, "palette", 0, 1000000)));
  let n = 0;
  input.firstRegisteredPaletteGrid.forEach((r, y) =>
    r.forEach((v, x) => {
      if (v !== input.secondRegisteredPaletteGrid[y][x]) n++;
    }),
  );
  return {
    exactMismatchCount: n,
    mismatchedCellFraction: n / (w * input.firstRegisteredPaletteGrid.length),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    firstRegisteredPaletteGrid: [
      [1, 2],
      [3, 4],
    ],
    secondRegisteredPaletteGrid: [
      [1, 2],
      [3, 5],
    ],
  },
  output: { result: { exactMismatchCount: 1, mismatchedCellFraction: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/difference-hamming-pixel",
  title: "Flag Difference Hamming Pixel Comparator",
  description:
    "Exact Hamming comparison of registered categorical flag pixel grids, no image scaling, palette remapping, perceptual distance or political-identity inference.",
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
