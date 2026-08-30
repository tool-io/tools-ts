import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ColumnWidthFromFontSizeChInput = Readonly<{
  readonly zeroGlyphWidthPixels: number;
  readonly characters: number;
}>;
export type ColumnWidthFromFontSizeChOutput = Readonly<{
  readonly columnWidthPixels: number;
}>;

export const calculateColumnWidthFromFontSizeCh = (
  x: ColumnWidthFromFontSizeChInput,
): ColumnWidthFromFontSizeChOutput => {
  if (!Number.isFinite(x.zeroGlyphWidthPixels) || x.zeroGlyphWidthPixels <= 0)
    simpleError("zeroGlyphWidthPixels", "Provide a finite positive number.");
  if (!Number.isFinite(x.characters) || x.characters <= 0)
    simpleError("characters", "Provide a finite positive number.");
  const columnWidthPixels = x.zeroGlyphWidthPixels * x.characters;
  if (!Number.isFinite(columnWidthPixels))
    simpleError(
      "columnWidthPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    columnWidthPixels: Object.is(columnWidthPixels, -0) ? 0 : columnWidthPixels,
  };
};

export const example = {
  input: {
    zeroGlyphWidthPixels: 8,
    characters: 60,
  },
  output: { columnWidthPixels: 480 },
} satisfies ToolExample<
  ColumnWidthFromFontSizeChInput,
  ColumnWidthFromFontSizeChOutput
>;

export const tool = createSimpleTool({
  id: "typography/column-width-from-font-size-ch",
  title: "Column Width From Font Size Ch",
  description:
    "Approximate column width in pixels from a measured 1ch glyph width and desired character count.",
  inputs: [
    {
      id: "zeroGlyphWidthPixels",
      kind: "number",
      label: "Zero Glyph Width Pixels",
      unit: "px",
      minimum: 0,
    },
    { id: "characters", kind: "number", label: "Characters", minimum: 0 },
  ],
  outputs: [
    {
      id: "columnWidthPixels",
      kind: "number",
      label: "Column Width Pixels",
      unit: "px",
    },
  ],
  calculate: (input) =>
    calculateColumnWidthFromFontSizeCh({
      zeroGlyphWidthPixels: input.zeroGlyphWidthPixels as number,
      characters: input.characters as number,
    }),
});
export const columnWidthFromFontSizeChTool = tool;
export const runColumnWidthFromFontSizeCh = tool.execute;
export default tool;
