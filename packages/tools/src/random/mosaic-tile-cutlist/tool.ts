import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  nonnegative,
  num,
  integer,
  object,
  label,
  countsSchema,
  run,
  pick,
  counts,
  distinct,
  finite,
  simpleError,
  type AcCount,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import { area, type Rect } from "../m500b-art-craft-geometry.js";
export type MosaicTileCutlistInput = AcSeed & {
  readonly width: number;
  readonly height: number;
  readonly gap: number;
  readonly maximumPieces: number;
  readonly tiles: readonly {
    readonly id: string;
    readonly width: number;
    readonly height: number;
  }[];
};
export type MosaicTileCutlistOutput = AcReplay & {
  readonly pieces: readonly (Rect & {
    readonly tileId: string;
    readonly area: number;
  })[];
  readonly cutCounts: readonly AcCount[];
  readonly panelArea: number;
  readonly pieceArea: number;
  readonly uncoveredArea: number;
};
export const inputSchema = inputObject({
  width: positive,
  height: positive,
  gap: nonnegative,
  maximumPieces: integer(1, 64),
  tiles: array(object({ id: label, width: positive, height: positive }), 16, 1),
});
export const outputSchema = outputObject({
  pieces: array(
    object({
      tileId: label,
      x: num,
      y: num,
      width: positive,
      height: positive,
      area: positive,
    }),
    64,
  ),
  cutCounts: countsSchema,
  panelArea: positive,
  pieceArea: nonnegative,
  uncoveredArea: nonnegative,
});
const isInput = (v: unknown): v is MosaicTileCutlistInput =>
  matchesModelInput(v, inputSchema);
export const calculateMosaicTileCutlist = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<MosaicTileCutlistOutput, "randomness"> => {
      distinct(
        x.tiles.map((t) => t.id),
        "tiles",
      );
      const panelArea = area(x.width, x.height),
        pieces: MosaicTileCutlistOutput["pieces"][number][] = [];
      let cx = 0,
        cy = 0,
        rowHeight = 0;
      while (pieces.length < x.maximumPieces) {
        const candidates = x.tiles.filter(
          (t) => t.width <= x.width - cx && t.height <= x.height - cy,
        );
        if (candidates.length === 0) {
          if (rowHeight === 0) break;
          cy = finite(cy + rowHeight + x.gap);
          cx = 0;
          rowHeight = 0;
          if (cy >= x.height) break;
          continue;
        }
        const t = pick(candidates, random);
        if (cx + t.width === cx || cy + t.height === cy)
          return simpleError(
            "tiles",
            "A selected tile loses positive coordinate extent at this magnitude.",
            "numeric_resolution",
          );
        pieces.push({
          tileId: t.id,
          x: cx,
          y: cy,
          width: t.width,
          height: t.height,
          area: area(t.width, t.height),
        });
        cx = finite(cx + t.width + x.gap);
        rowHeight = Math.max(rowHeight, t.height);
      }
      const pieceArea = finite(pieces.reduce((s, p) => s + p.area, 0)),
        uncoveredArea = finite(panelArea - pieceArea);
      if (uncoveredArea < 0)
        return simpleError(
          "dimensions",
          "Area accounting is below numeric resolution.",
          "numeric_resolution",
        );
      return {
        pieces,
        cutCounts: counts(
          pieces.map((p) => p.tileId),
          x.tiles.map((t) => t.id),
        ),
        panelArea,
        pieceArea,
        uncoveredArea,
      };
    },
  );
export const mosaicTileCutlistExample = {
  input: {
    width: 4,
    height: 2,
    gap: 0,
    maximumPieces: 4,
    tiles: [{ id: "square", width: 2, height: 2 }],
    seed: 42,
  },
  output: {
    pieces: [
      { tileId: "square", x: 0, y: 0, width: 2, height: 2, area: 4 },
      { tileId: "square", x: 2, y: 0, width: 2, height: 2, area: 4 },
    ],
    cutCounts: [{ id: "square", count: 2 }],
    panelArea: 8,
    pieceArea: 8,
    uncoveredArea: 0,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<MosaicTileCutlistInput, MosaicTileCutlistOutput>;
export const mosaicTileCutlistTool = createModelDefinition<
  MosaicTileCutlistInput,
  MosaicTileCutlistOutput
>({
  id: "random/mosaic-tile-cutlist",
  title: "Random Mosaic Tile Cutlist Generator",
  description:
    "Build a bounded rectangular-tile shelf cutlist using caller gaps, dimensions and piece types, retaining counts and uncovered area without optimality or cutting-tolerance claims.",
  inputSchema,
  outputSchema,
  execute: calculateMosaicTileCutlist,
});
export const runMosaicTileCutlist = mosaicTileCutlistTool.execute;
export default mosaicTileCutlistTool;
