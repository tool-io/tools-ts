import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PixelsToRem16baseInput = Readonly<{
  readonly pixels: number;
}>;
export type PixelsToRem16baseOutput = Readonly<{
  readonly rem: number;
}>;

export const calculatePixelsToRem16base = (
  x: PixelsToRem16baseInput,
): PixelsToRem16baseOutput => {
  if (!Number.isFinite(x.pixels) || x.pixels < 0)
    simpleError("pixels", "Provide a finite nonnegative number.");
  const rem = x.pixels / 16;
  if (!Number.isFinite(rem))
    simpleError("rem", "Inputs produce an undefined or out-of-range result.");
  return { rem: Object.is(rem, -0) ? 0 : rem };
};

export const example = {
  input: {
    pixels: 32,
  },
  output: { rem: 2 },
} satisfies ToolExample<PixelsToRem16baseInput, PixelsToRem16baseOutput>;

export const tool = createSimpleTool({
  id: "typography/pixels-to-rem-16base",
  title: "Pixels To Rem 16base",
  description: "CSS rem units from CSS pixels using a 16-pixel root font size.",
  inputs: [
    { id: "pixels", kind: "number", label: "Pixels", unit: "px", minimum: 0 },
  ],
  outputs: [{ id: "rem", kind: "number", label: "Rem", unit: "rem" }],
  calculate: (input) =>
    calculatePixelsToRem16base({
      pixels: input.pixels as number,
    }),
});
export const pixelsToRem16baseTool = tool;
export const runPixelsToRem16base = tool.execute;
export default tool;
