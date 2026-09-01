import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  bounded,
} from "../shared.js";
export type Input = Readonly<{
  readonly glyphCountsByClass: readonly number[];
  readonly callerBytesPerGlyphByClass: readonly number[];
  readonly callerFixedTableBytes: number;
  readonly callerDirectoryRecordCount: number;
  readonly alignmentBytes: number;
}>;
export type Output = Readonly<{
  readonly modelGlyphBytes: number;
  readonly modelUncompressedFontBytes: number;
}>;
const inputFields = [
  {
    id: "glyphCountsByClass",
    label: "Glyph counts by class",
    kind: "numberList",
  },
  {
    id: "callerBytesPerGlyphByClass",
    label: "Caller bytes per glyph by class",
    kind: "numberList",
  },
  {
    id: "callerFixedTableBytes",
    label: "Caller fixed table bytes",
    kind: "number",
  },
  {
    id: "callerDirectoryRecordCount",
    label: "Caller directory record count",
    kind: "number",
  },
  { id: "alignmentBytes", label: "Alignment bytes", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.alignmentBytes, "alignmentBytes");
  input.callerBytesPerGlyphByClass.forEach((v) =>
    nonnegative(v, "callerBytesPerGlyphByClass"),
  );
  input.glyphCountsByClass.forEach((v) => count(v, "glyphCountsByClass"));
  count(input.callerFixedTableBytes, "callerFixedTableBytes");
  count(input.callerDirectoryRecordCount, "callerDirectoryRecordCount");
  count(input.alignmentBytes, "alignmentBytes");
  aligned(
    input.glyphCountsByClass,
    input.callerBytesPerGlyphByClass,
    "glyphCountsByClass",
  );
  bounded(input.alignmentBytes, "alignmentBytes", 1, 64);
  const glyph = input.glyphCountsByClass.reduce(
    (s, v, i) =>
      s +
      v *
        Math.ceil(input.callerBytesPerGlyphByClass[i] / input.alignmentBytes) *
        input.alignmentBytes,
    0,
  );
  count(glyph, "glyphBytes");
  return {
    modelGlyphBytes: glyph,
    modelUncompressedFontBytes: count(
      glyph +
        input.callerFixedTableBytes +
        12 +
        16 * input.callerDirectoryRecordCount,
      "fontBytes",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  glyphCountsByClass: [10, 20],
  callerBytesPerGlyphByClass: [100, 200],
  callerFixedTableBytes: 1000,
  callerDirectoryRecordCount: 10,
  alignmentBytes: 4,
} satisfies Input;
export const exampleOutput = {
  modelGlyphBytes: 5000,
  modelUncompressedFontBytes: 6172,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/font-file-size-estimate-glyphs",
  title: "Font File Size Estimate From Glyph Count",
  description:
    "Budget uncompressed SFNT bytes from caller glyph-class costs, per-glyph alignment, table overhead and directory records; explicit estimate, not WOFF compression or exact real glyph size.",
  inputs: inputFields,
  outputs: [
    { id: "modelGlyphBytes", label: "Model glyph bytes", kind: "number" },
    {
      id: "modelUncompressedFontBytes",
      label: "Model uncompressed font bytes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      glyphCountsByClass: value.glyphCountsByClass as readonly number[],
      callerBytesPerGlyphByClass:
        value.callerBytesPerGlyphByClass as readonly number[],
      callerFixedTableBytes: value.callerFixedTableBytes as number,
      callerDirectoryRecordCount: value.callerDirectoryRecordCount as number,
      alignmentBytes: value.alignmentBytes as number,
    }),
});
export const run = tool.execute;
export default tool;
