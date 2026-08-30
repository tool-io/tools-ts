import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RemToPixels16baseInput = Readonly<{
  readonly rem: number;
}>;
export type RemToPixels16baseOutput = Readonly<{
  readonly pixels: number;
}>;

export const calculateRemToPixels16base = (
  x: RemToPixels16baseInput,
): RemToPixels16baseOutput => {
  if (!Number.isFinite(x.rem) || x.rem < 0)
    simpleError("rem", "Provide a finite nonnegative number.");
  const pixels = 16 * x.rem;
  if (!Number.isFinite(pixels))
    simpleError(
      "pixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pixels: Object.is(pixels, -0) ? 0 : pixels };
};

export const example = {
  input: {
    rem: 2,
  },
  output: { pixels: 32 },
} satisfies ToolExample<RemToPixels16baseInput, RemToPixels16baseOutput>;

export const tool = createSimpleTool({
  id: "typography/rem-to-pixels-16base",
  title: "Rem To Pixels 16base",
  description: "CSS pixels from rem units using a 16-pixel root font size.",
  inputs: [
    { id: "rem", kind: "number", label: "Rem", unit: "rem", minimum: 0 },
  ],
  outputs: [{ id: "pixels", kind: "number", label: "Pixels", unit: "px" }],
  calculate: (input) =>
    calculateRemToPixels16base({
      rem: input.rem as number,
    }),
});
export const remToPixels16baseTool = tool;
export const runRemToPixels16base = tool.execute;
export default tool;
