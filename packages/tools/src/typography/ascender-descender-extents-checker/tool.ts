import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, shape } from "../shared.js";
export type Input = Readonly<{
  readonly glyphYBoundsUnits: readonly (readonly number[])[];
  readonly declaredAscentUnits: number;
  readonly declaredDescentUnits: number;
}>;
export type Output = Readonly<{
  readonly glyphAscentOverflowUnits: readonly number[];
  readonly glyphDescentOverflowUnits: readonly number[];
  readonly anyVerticalExtentOverflow: boolean;
}>;
const inputFields = [
  { id: "glyphYBoundsUnits", label: "Glyph y bounds units", kind: "matrix" },
  { id: "declaredAscentUnits", label: "Declared ascent units", kind: "number" },
  {
    id: "declaredDescentUnits",
    label: "Declared descent units",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.declaredAscentUnits, "declaredAscentUnits");
  nonnegative(input.declaredDescentUnits, "declaredDescentUnits");
  if (
    shape(input.glyphYBoundsUnits, "bounds") !== 2 ||
    input.glyphYBoundsUnits.some((r) => r[1] < r[0])
  )
    simpleError("bounds", "Ordered glyph min/max Y pairs required.");
  const a = input.glyphYBoundsUnits.map((r) =>
      Math.max(0, r[1] - input.declaredAscentUnits),
    ),
    d = input.glyphYBoundsUnits.map((r) =>
      Math.max(0, -r[0] - input.declaredDescentUnits),
    );
  return {
    glyphAscentOverflowUnits: a,
    glyphDescentOverflowUnits: d,
    anyVerticalExtentOverflow: a.some((v) => v > 0) || d.some((v) => v > 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  glyphYBoundsUnits: [
    [-200, 700],
    [-250, 800],
  ],
  declaredAscentUnits: 750,
  declaredDescentUnits: 200,
} satisfies Input;
export const exampleOutput = {
  glyphAscentOverflowUnits: [0, 50],
  glyphDescentOverflowUnits: [0, 50],
  anyVerticalExtentOverflow: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/ascender-descender-extents-checker",
  title: "Ascender/Descender Extents Checker",
  description:
    "Audit observed glyph outline bounds against declared ascent and positive descent magnitude; preserves per-glyph upper/lower overflow, not automatic clipping or font-table truth.",
  inputs: inputFields,
  outputs: [
    {
      id: "glyphAscentOverflowUnits",
      label: "Glyph ascent overflow units",
      kind: "numberList",
    },
    {
      id: "glyphDescentOverflowUnits",
      label: "Glyph descent overflow units",
      kind: "numberList",
    },
    {
      id: "anyVerticalExtentOverflow",
      label: "Any vertical extent overflow",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      glyphYBoundsUnits:
        value.glyphYBoundsUnits as readonly (readonly number[])[],
      declaredAscentUnits: value.declaredAscentUnits as number,
      declaredDescentUnits: value.declaredDescentUnits as number,
    }),
});
export const run = tool.execute;
export default tool;
