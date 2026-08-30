import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PixelCountTotalInput = Readonly<{
  readonly widthPixels: number;
  readonly heightPixels: number;
}>;
export type PixelCountTotalOutput = Readonly<{
  readonly pixelCount: number;
}>;

export const calculatePixelCountTotal = (
  x: PixelCountTotalInput,
): PixelCountTotalOutput => {
  if (!Number.isFinite(x.widthPixels) || x.widthPixels < 1)
    simpleError("widthPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.heightPixels) || x.heightPixels < 1)
    simpleError("heightPixels", "Provide a finite number at least 1.");
  if (
    !Number.isSafeInteger(x.widthPixels) ||
    !Number.isSafeInteger(x.heightPixels) ||
    x.widthPixels * x.heightPixels > Number.MAX_SAFE_INTEGER
  )
    simpleError("input", "Inputs violate the stated model or operating range.");
  const pixelCount = x.widthPixels * x.heightPixels;
  if (!Number.isFinite(pixelCount))
    simpleError(
      "pixelCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pixelCount: Object.is(pixelCount, -0) ? 0 : pixelCount };
};

export const example = {
  input: { widthPixels: 1920, heightPixels: 1080 },
  output: { pixelCount: 2073600 },
} satisfies ToolExample<PixelCountTotalInput, PixelCountTotalOutput>;

export const tool = createSimpleTool({
  id: "film/pixel-count-total",
  title: "Pixel Count Total",
  description:
    "Total image pixels from integer width and height; rejects products above JavaScript's exact safe-integer range.",
  inputs: [
    {
      id: "widthPixels",
      kind: "integer",
      label: "Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "heightPixels",
      kind: "integer",
      label: "Height Pixels",
      unit: "px",
      minimum: 1,
    },
  ],
  outputs: [
    { id: "pixelCount", kind: "number", label: "Pixel Count", unit: "px" },
  ],
  calculate: (input) =>
    calculatePixelCountTotal({
      widthPixels: input.widthPixels as number,
      heightPixels: input.heightPixels as number,
    }),
});
export const pixelCountTotalTool = tool;
export const runPixelCountTotal = tool.execute;
export default tool;
