import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TilesWithGroutInput = Readonly<{
  readonly surfaceLengthMm: number;
  readonly surfaceWidthMm: number;
  readonly tileLengthMm: number;
  readonly tileWidthMm: number;
  readonly jointWidthMm: number;
}>;
export type TilesWithGroutOutput = Readonly<{
  readonly tileCount: number;
}>;

export const calculateTilesWithGrout = (
  x: TilesWithGroutInput,
): TilesWithGroutOutput => {
  if (!Number.isFinite(x.surfaceLengthMm) || x.surfaceLengthMm < 0)
    simpleError("surfaceLengthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.surfaceWidthMm) || x.surfaceWidthMm < 0)
    simpleError("surfaceWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.tileLengthMm) || x.tileLengthMm < 0)
    simpleError("tileLengthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.tileWidthMm) || x.tileWidthMm < 0)
    simpleError("tileWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.jointWidthMm) || x.jointWidthMm < 0)
    simpleError("jointWidthMm", "Provide a finite number at least 0.");
  if (!(x.tileLengthMm > 0 && x.tileWidthMm > 0))
    simpleError("tileLengthMm", "Tile dimensions must be positive.");
  const tileCount =
    x.surfaceLengthMm === 0 || x.surfaceWidthMm === 0
      ? 0
      : Math.ceil(
          (x.surfaceLengthMm + x.jointWidthMm) /
            (x.tileLengthMm + x.jointWidthMm),
        ) *
        Math.ceil(
          (x.surfaceWidthMm + x.jointWidthMm) /
            (x.tileWidthMm + x.jointWidthMm),
        );
  if (!Number.isFinite(tileCount) || !Number.isSafeInteger(tileCount))
    simpleError("tileCount", "The inputs produce an invalid result.");
  return { tileCount: Object.is(tileCount, -0) ? 0 : tileCount };
};

export const example = {
  input: {
    surfaceLengthMm: 3000,
    surfaceWidthMm: 2000,
    tileLengthMm: 300,
    tileWidthMm: 200,
    jointWidthMm: 5,
  },
  output: { tileCount: 100 },
} satisfies ToolExample<TilesWithGroutInput, TilesWithGroutOutput>;

export const tool = createSimpleTool({
  id: "construction/tiles-with-grout",
  title: "Tiles With Grout",
  description:
    "Count whole rectangular tiles for a rectangular surface using tile size and uniform grout-joint width; no staggering or cut reuse.",
  inputs: [
    {
      id: "surfaceLengthMm",
      kind: "number",
      label: "Surface length",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "surfaceWidthMm",
      kind: "number",
      label: "Surface width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "tileLengthMm",
      kind: "number",
      label: "Tile length",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "tileWidthMm",
      kind: "number",
      label: "Tile width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "jointWidthMm",
      kind: "number",
      label: "Grout joint",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "tileCount", kind: "integer", label: "Whole tile positions" },
  ],
  calculate: (input) =>
    calculateTilesWithGrout({
      surfaceLengthMm: input.surfaceLengthMm as number,
      surfaceWidthMm: input.surfaceWidthMm as number,
      tileLengthMm: input.tileLengthMm as number,
      tileWidthMm: input.tileWidthMm as number,
      jointWidthMm: input.jointWidthMm as number,
    }),
});
export const tilesWithGroutTool = tool;
export const runTilesWithGrout = tool.execute;
export default tool;
