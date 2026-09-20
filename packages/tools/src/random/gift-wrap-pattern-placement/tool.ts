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
  run,
  pick,
  distinct,
  finite,
  simpleError,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import {
  area,
  overlap,
  rectSchema,
  type Rect,
} from "../m500b-art-craft-geometry.js";
export type GiftWrapPatternPlacementInput = AcSeed & {
  readonly width: number;
  readonly height: number;
  readonly foldLines: readonly number[];
  readonly foldClearance: number;
  readonly motifs: readonly {
    readonly id: string;
    readonly width: number;
    readonly height: number;
  }[];
  readonly count: number;
};
export type GiftWrapPatternPlacementOutput = AcReplay & {
  readonly safeBands: readonly Rect[];
  readonly placements: readonly (Rect & {
    readonly motifId: string;
    readonly bandIndex: number;
    readonly area: number;
  })[];
  readonly overlapPairs: readonly (readonly [number, number])[];
  readonly sheetArea: number;
};
export const inputSchema = inputObject({
  width: positive,
  height: positive,
  foldLines: array(positive, 16),
  foldClearance: nonnegative,
  motifs: array(
    object({ id: label, width: positive, height: positive }),
    16,
    1,
  ),
  count: integer(1, 32),
});
export const outputSchema = outputObject({
  safeBands: array(rectSchema, 17),
  placements: array(
    object({
      motifId: label,
      bandIndex: integer(0, 16),
      x: num,
      y: num,
      width: positive,
      height: positive,
      area: positive,
    }),
    32,
    1,
  ),
  overlapPairs: array(array(integer(0, 31), 2, 2), 496),
  sheetArea: positive,
});
const isInput = (v: unknown): v is GiftWrapPatternPlacementInput =>
  matchesModelInput(v, inputSchema);
export const calculateGiftWrapPatternPlacement = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<GiftWrapPatternPlacementOutput, "randomness"> => {
      distinct(
        x.motifs.map((m) => m.id),
        "motifs",
      );
      distinct(x.foldLines.map(String), "foldLines");
      if (x.foldLines.some((f) => f >= x.width))
        return simpleError(
          "foldLines",
          "Vertical folds must lie strictly inside the sheet.",
          "outside_sheet",
        );
      const safeBands: Rect[] = [];
      let cursor = 0;
      for (const f of [...x.foldLines].sort((a, b) => a - b)) {
        const lo = Math.max(0, finite(f - x.foldClearance)),
          hi = Math.min(x.width, finite(f + x.foldClearance));
        if (lo > cursor)
          safeBands.push({
            x: cursor,
            y: 0,
            width: lo - cursor,
            height: x.height,
          });
        cursor = Math.max(cursor, hi);
      }
      if (cursor < x.width)
        safeBands.push({
          x: cursor,
          y: 0,
          width: x.width - cursor,
          height: x.height,
        });
      const candidates = safeBands.flatMap((b, bandIndex) =>
        x.motifs
          .filter((m) => m.width <= b.width && m.height <= b.height)
          .map((m) => ({ m, b, bandIndex })),
      );
      if (candidates.length === 0)
        return simpleError(
          "motifs",
          "No motif fits a fold-clear safe band.",
          "no_fit",
        );
      const placements = Array.from({ length: x.count }, () => {
        const { m, b, bandIndex } = pick(candidates, random),
          dx = b.width - m.width,
          dy = b.height - m.height;
        return {
          motifId: m.id,
          bandIndex,
          x: finite(b.x + (dx > 0 ? random.unit() * dx : 0)),
          y: finite(dy > 0 ? random.unit() * dy : 0),
          width: m.width,
          height: m.height,
          area: area(m.width, m.height),
        };
      });
      const overlapPairs: [number, number][] = [];
      for (let i = 0; i < placements.length; i++)
        for (let j = i + 1; j < placements.length; j++)
          if (overlap(placements[i], placements[j])) overlapPairs.push([i, j]);
      return {
        safeBands,
        placements,
        overlapPairs,
        sheetArea: area(x.width, x.height),
      };
    },
  );
export const giftWrapPatternPlacementExample = {
  input: {
    width: 6,
    height: 4,
    foldLines: [3],
    foldClearance: 1,
    motifs: [{ id: "sprig", width: 2, height: 4 }],
    count: 2,
    seed: 42,
  },
  output: {
    safeBands: [
      { x: 0, y: 0, width: 2, height: 4 },
      { x: 4, y: 0, width: 2, height: 4 },
    ],
    placements: [
      {
        motifId: "sprig",
        bandIndex: 1,
        x: 4,
        y: 0,
        width: 2,
        height: 4,
        area: 8,
      },
      {
        motifId: "sprig",
        bandIndex: 0,
        x: 0,
        y: 0,
        width: 2,
        height: 4,
        area: 8,
      },
    ],
    overlapPairs: [],
    sheetArea: 24,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  GiftWrapPatternPlacementInput,
  GiftWrapPatternPlacementOutput
>;
export const giftWrapPatternPlacementTool = createModelDefinition<
  GiftWrapPatternPlacementInput,
  GiftWrapPatternPlacementOutput
>({
  id: "random/gift-wrap-pattern-placement",
  title: "Random Gift Wrap Pattern Placement Plan Generator",
  description:
    "Place caller motifs inside vertical fold-clearance bands on a repeat sheet with explicit allowed-overlap tags; app artwork and repeat-edge rendering remain external.",
  inputSchema,
  outputSchema,
  execute: calculateGiftWrapPatternPlacement,
});
export const runGiftWrapPatternPlacement = giftWrapPatternPlacementTool.execute;
export default giftWrapPatternPlacementTool;
