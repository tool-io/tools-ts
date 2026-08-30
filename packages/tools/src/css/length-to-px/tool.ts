import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LengthToPxInput = Readonly<{
  readonly length: string;
  readonly rootFontPx: number;
  readonly elementFontPx: number;
  readonly viewportWidthPx: number;
  readonly viewportHeightPx: number;
}>;
export type LengthToPxOutput = Readonly<{
  readonly pixels: number;
}>;

export const calculateLengthToPx = (x: LengthToPxInput): LengthToPxOutput => {
  if (typeof x.length !== "string") simpleError("length", "Provide a string.");
  if (!Number.isFinite(x.rootFontPx))
    simpleError("rootFontPx", "Provide a finite number.");
  if (!Number.isFinite(x.elementFontPx))
    simpleError("elementFontPx", "Provide a finite number.");
  if (!Number.isFinite(x.viewportWidthPx))
    simpleError("viewportWidthPx", "Provide a finite number.");
  if (!Number.isFinite(x.viewportHeightPx))
    simpleError("viewportHeightPx", "Provide a finite number.");
  if (
    x.rootFontPx < 0 ||
    x.elementFontPx < 0 ||
    x.viewportWidthPx < 0 ||
    x.viewportHeightPx < 0
  )
    simpleError("length", "Font and viewport dimensions cannot be negative.");
  const match = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(px|rem|em|vw|vh)$/i.exec(
    x.length.trim(),
  );
  if (!match)
    return simpleError(
      "length",
      "Use a numeric px, rem, em, vw, or vh length.",
    );
  const n = Number(match[1]);
  const unit = match[2].toLowerCase();
  const factor =
    unit === "px"
      ? 1
      : unit === "rem"
        ? x.rootFontPx
        : unit === "em"
          ? x.elementFontPx
          : unit === "vw"
            ? x.viewportWidthPx / 100
            : x.viewportHeightPx / 100;
  const pixels = n * factor;
  if (!Number.isFinite(pixels))
    simpleError("length", "Length result is not finite.");
  return { pixels };
};

export const example = {
  input: {
    length: "1.5rem",
    rootFontPx: 16,
    elementFontPx: 20,
    viewportWidthPx: 1200,
    viewportHeightPx: 800,
  },
  output: { pixels: 24 },
} satisfies ToolExample<LengthToPxInput, LengthToPxOutput>;

export const tool = createSimpleTool({
  id: "css/length-to-px",
  title: "CSS Length to Pixels",
  description:
    "Convert px, rem, em, vw, and vh CSS lengths to pixels using explicit root, element, and viewport dimensions; unsupported units are rejected.",
  inputs: [
    { id: "length", kind: "string", label: "CSS length" },
    { id: "rootFontPx", kind: "number", label: "Root font size", unit: "px" },
    {
      id: "elementFontPx",
      kind: "number",
      label: "Element font size",
      unit: "px",
    },
    {
      id: "viewportWidthPx",
      kind: "number",
      label: "Viewport width",
      unit: "px",
    },
    {
      id: "viewportHeightPx",
      kind: "number",
      label: "Viewport height",
      unit: "px",
    },
  ],
  outputs: [
    { id: "pixels", kind: "number", label: "Computed length", unit: "px" },
  ],
  calculate: (input) =>
    calculateLengthToPx({
      length: input.length as string,
      rootFontPx: input.rootFontPx as number,
      elementFontPx: input.elementFontPx as number,
      viewportWidthPx: input.viewportWidthPx as number,
      viewportHeightPx: input.viewportHeightPx as number,
    }),
});
export const lengthToPxTool = tool;
export const runLengthToPx = tool.execute;
export default tool;
