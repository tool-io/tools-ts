import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TileGroutVolumeInput = Readonly<{
  readonly surfaceAreaM2: number;
  readonly tileLengthMm: number;
  readonly tileWidthMm: number;
  readonly jointWidthMm: number;
  readonly jointDepthMm: number;
}>;
export type TileGroutVolumeOutput = Readonly<{
  readonly groutVolumeLiters: number;
}>;

export const calculateTileGroutVolume = (
  x: TileGroutVolumeInput,
): TileGroutVolumeOutput => {
  if (!Number.isFinite(x.surfaceAreaM2) || x.surfaceAreaM2 < 0)
    simpleError("surfaceAreaM2", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.tileLengthMm) || x.tileLengthMm < 0)
    simpleError("tileLengthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.tileWidthMm) || x.tileWidthMm < 0)
    simpleError("tileWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.jointWidthMm) || x.jointWidthMm < 0)
    simpleError("jointWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.jointDepthMm) || x.jointDepthMm < 0)
    simpleError("jointDepthMm", "Provide a finite number at least 0.");
  if (!(x.tileLengthMm > 0 && x.tileWidthMm > 0))
    simpleError("tileLengthMm", "Tile dimensions must be positive.");
  const groutVolumeLiters =
    x.surfaceAreaM2 *
    (1 -
      (x.tileLengthMm * x.tileWidthMm) /
        ((x.tileLengthMm + x.jointWidthMm) *
          (x.tileWidthMm + x.jointWidthMm))) *
    x.jointDepthMm;
  if (!Number.isFinite(groutVolumeLiters))
    simpleError("groutVolumeLiters", "The inputs produce an invalid result.");
  return {
    groutVolumeLiters: Object.is(groutVolumeLiters, -0) ? 0 : groutVolumeLiters,
  };
};

export const example = {
  input: {
    surfaceAreaM2: 10,
    tileLengthMm: 300,
    tileWidthMm: 200,
    jointWidthMm: 5,
    jointDepthMm: 5,
  },
  output: { groutVolumeLiters: 2.019192323070773 },
} satisfies ToolExample<TileGroutVolumeInput, TileGroutVolumeOutput>;

export const tool = createSimpleTool({
  id: "construction/tile-grout-volume",
  title: "Tile Grout Volume",
  description:
    "Approximate grout volume for a rectangular tile grid from its surface area, tile dimensions, joint width, and joint depth.",
  inputs: [
    {
      id: "surfaceAreaM2",
      kind: "number",
      label: "Tiled surface area",
      unit: "m²",
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
      label: "Joint width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "jointDepthMm",
      kind: "number",
      label: "Joint depth",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "groutVolumeLiters",
      kind: "number",
      label: "Approximate grout volume",
      unit: "L",
    },
  ],
  calculate: (input) =>
    calculateTileGroutVolume({
      surfaceAreaM2: input.surfaceAreaM2 as number,
      tileLengthMm: input.tileLengthMm as number,
      tileWidthMm: input.tileWidthMm as number,
      jointWidthMm: input.jointWidthMm as number,
      jointDepthMm: input.jointDepthMm as number,
    }),
});
export const tileGroutVolumeTool = tool;
export const runTileGroutVolume = tool.execute;
export default tool;
