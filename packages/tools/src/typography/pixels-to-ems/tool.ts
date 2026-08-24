import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const DEFAULT_ROOT_FONT_SIZE_PX = 16;

export type PixelsToEmsInput = {
  readonly pixelsPx: number;
  readonly rootFontSizePx?: number;
};

export type PixelsToEmsOutput = {
  readonly emValue: number;
};

export const pixelsToEmsExample = {
  input: { pixelsPx: 24 },
  output: { emValue: 1.5 },
} satisfies ToolExample<PixelsToEmsInput, PixelsToEmsOutput>;

export const pixelsToEmsTool = createSimpleTool({
  id: "typography/pixels-to-ems",
  title: "Pixels to Ems Converter",
  description: "Convert a length in pixels to ems for a root font size.",
  inputs: [
    {
      description: "Length in pixels.",
      id: "pixelsPx",
      kind: "number",
      label: "Pixels",
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
      description: "Equivalent length in ems.",
      id: "emValue",
      kind: "number",
      label: "Ems",
    },
  ],
  calculate: (input) => {
    const pixelsPx = input.pixelsPx as number;
    const rootFontSizePx = input.rootFontSizePx as number;
    if (!(rootFontSizePx > 0))
      simpleError(
        "rootFontSizePx",
        "Root font size must be greater than zero.",
      );
    return { emValue: pixelsPx / rootFontSizePx };
  },
});

export const runPixelsToEms = pixelsToEmsTool.execute;
export default pixelsToEmsTool;
