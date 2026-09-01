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
  count,
  totalCount,
  closure,
} from "../shared.js";
export type Input = Readonly<{
  readonly requestedGlyphIndices: readonly number[];
  readonly glyphDependencyAdjacency: readonly (readonly number[])[];
  readonly measuredGlyphBytes: readonly number[];
  readonly callerFixedFontBytes: number;
}>;
export type Output = Readonly<{
  readonly retainedGlyphIndices: readonly number[];
  readonly retainedGlyphCount: number;
  readonly modelOriginalBytes: number;
  readonly modelSubsetBytes: number;
  readonly modelByteSavingsPercent: number;
  readonly glyphCountSavingsPercent: number;
}>;
const inputFields = [
  {
    id: "requestedGlyphIndices",
    label: "Requested glyph indices",
    kind: "numberList",
  },
  {
    id: "glyphDependencyAdjacency",
    label: "Glyph dependency adjacency",
    kind: "matrix",
  },
  {
    id: "measuredGlyphBytes",
    label: "Measured glyph bytes",
    kind: "numberList",
  },
  {
    id: "callerFixedFontBytes",
    label: "Caller fixed font bytes",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.requestedGlyphIndices.forEach((v) => count(v, "requestedGlyphIndices"));
  input.measuredGlyphBytes.forEach((v) => count(v, "measuredGlyphBytes"));
  count(input.callerFixedFontBytes, "callerFixedFontBytes");
  if (
    input.measuredGlyphBytes.length !== input.glyphDependencyAdjacency.length ||
    !input.requestedGlyphIndices.length
  )
    simpleError(
      "glyphs",
      "Aligned glyph byte/dependency inventory and requested subset required.",
    );
  const retain = closure(
      input.requestedGlyphIndices,
      input.glyphDependencyAdjacency,
    ),
    old = count(
      totalCount(input.measuredGlyphBytes, "glyphBytes") +
        input.callerFixedFontBytes,
      "fullBytes",
    ),
    newSize = count(
      retain.reduce(
        (s, i) => s + input.measuredGlyphBytes[i],
        input.callerFixedFontBytes,
      ),
      "subsetBytes",
    );
  positive(old, "fullBytes");
  return {
    retainedGlyphIndices: retain,
    retainedGlyphCount: retain.length,
    modelOriginalBytes: old,
    modelSubsetBytes: newSize,
    modelByteSavingsPercent: (100 * (old - newSize)) / old,
    glyphCountSavingsPercent:
      (100 * (input.measuredGlyphBytes.length - retain.length)) /
      input.measuredGlyphBytes.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  requestedGlyphIndices: [0],
  glyphDependencyAdjacency: [
    [0, 1, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  measuredGlyphBytes: [100, 200, 300],
  callerFixedFontBytes: 100,
} satisfies Input;
export const exampleOutput = {
  retainedGlyphIndices: [0, 1],
  retainedGlyphCount: 2,
  modelOriginalBytes: 700,
  modelSubsetBytes: 400,
  modelByteSavingsPercent: 42.857142857142854,
  glyphCountSavingsPercent: 33.333333333333336,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/webfont-subset-savings-percent-glyphs",
  title: "Webfont Subset Savings Percent Glyphs",
  description:
    "Budget subset savings from transitive composite-glyph dependencies and actual per-glyph/fixed bytes, not raw retained-count ratio alone; omits rewritten table/compression cost and font usability certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "retainedGlyphIndices",
      label: "Retained glyph indices",
      kind: "numberList",
    },
    { id: "retainedGlyphCount", label: "Retained glyph count", kind: "number" },
    { id: "modelOriginalBytes", label: "Model original bytes", kind: "number" },
    { id: "modelSubsetBytes", label: "Model subset bytes", kind: "number" },
    {
      id: "modelByteSavingsPercent",
      label: "Model byte savings percent",
      kind: "number",
    },
    {
      id: "glyphCountSavingsPercent",
      label: "Glyph count savings percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      requestedGlyphIndices: value.requestedGlyphIndices as readonly number[],
      glyphDependencyAdjacency:
        value.glyphDependencyAdjacency as readonly (readonly number[])[],
      measuredGlyphBytes: value.measuredGlyphBytes as readonly number[],
      callerFixedFontBytes: value.callerFixedFontBytes as number,
    }),
});
export const run = tool.execute;
export default tool;
