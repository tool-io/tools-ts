import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const DEFAULT_ROOT_FONT_SIZE_PX = 16;

export type EmsToPixelsInput = {
  readonly emValue: number;
  readonly rootFontSizePx?: number;
};

export type EmsToPixelsOutput = {
  readonly pixels: number;
};

export const emsToPixelsExample = {
  input: { emValue: 1.5 },
  output: { pixels: 24 },
} satisfies ToolExample<EmsToPixelsInput, EmsToPixelsOutput>;

export const emsToPixelsTool = createSimpleTool({
  id: "typography/ems-to-pixels",
  title: "Ems to Pixels Converter",
  description: "Convert a length in ems to pixels for a root font size.",
  inputs: [
    {
      description: "Length in ems.",
      id: "emValue",
      kind: "number",
      label: "Ems",
    },
    {
      default: DEFAULT_ROOT_FONT_SIZE_PX,
      description: "Root font size in pixels.",
      id: "rootFontSizePx",
      kind: "number",
      label: "Root font size (px)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Equivalent length in pixels.",
      id: "pixels",
      kind: "number",
      label: "Pixels",
    },
  ],
  calculate: (input) => {
    const emValue = input.emValue as number;
    const rootFontSizePx = input.rootFontSizePx as number;
    if (!(rootFontSizePx > 0))
      simpleError(
        "rootFontSizePx",
        "Root font size must be greater than zero.",
      );
    return { pixels: emValue * rootFontSizePx };
  },
});

export const runEmsToPixels = emsToPixelsTool.execute;
export default emsToPixelsTool;
