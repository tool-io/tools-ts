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
import { area, type Rect } from "../m500b-art-craft-geometry.js";
export type EmbroideryMotifPlacementInput = AcSeed & {
  readonly width: number;
  readonly height: number;
  readonly margin: number;
  readonly gap: number;
  readonly count: number;
  readonly motifs: readonly {
    readonly id: string;
    readonly width: number;
    readonly height: number;
  }[];
};
export type EmbroideryMotifPlacementOutput = AcReplay & {
  readonly placements: readonly (Rect & {
    readonly motifId: string;
    readonly index: number;
    readonly area: number;
  })[];
  readonly clothArea: number;
  readonly motifArea: number;
};
export const inputSchema = inputObject({
  width: positive,
  height: positive,
  margin: nonnegative,
  gap: nonnegative,
  count: integer(1, 32),
  motifs: array(
    object({ id: label, width: positive, height: positive }),
    16,
    1,
  ),
});
export const outputSchema = outputObject({
  placements: array(
    object({
      motifId: label,
      index: integer(0, 31),
      x: num,
      y: num,
      width: positive,
      height: positive,
      area: positive,
    }),
    32,
    1,
  ),
  clothArea: positive,
  motifArea: positive,
});
const isInput = (v: unknown): v is EmbroideryMotifPlacementInput =>
  matchesModelInput(v, inputSchema);
export const calculateEmbroideryMotifPlacement = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<EmbroideryMotifPlacementOutput, "randomness"> => {
      distinct(
        x.motifs.map((m) => m.id),
        "motifs",
      );
      const usableWidth = finite(x.width - 2 * x.margin),
        usableHeight = finite(x.height - 2 * x.margin),
        clothArea = area(x.width, x.height);
      if (usableWidth <= 0 || usableHeight <= 0)
        return simpleError(
          "margin",
          "Margin leaves no cloth interior.",
          "invalid_interior",
        );
      const placements: EmbroideryMotifPlacementOutput["placements"][number][] =
        [];
      let cx = 0,
        cy = 0,
        rowHeight = 0;
      while (placements.length < x.count) {
        let fitting = x.motifs.filter(
          (m) => m.width <= usableWidth - cx && m.height <= usableHeight - cy,
        );
        if (fitting.length === 0 && rowHeight > 0) {
          cy = finite(cy + rowHeight + x.gap);
          cx = 0;
          rowHeight = 0;
          fitting = x.motifs.filter(
            (m) => m.width <= usableWidth && m.height <= usableHeight - cy,
          );
        }
        if (fitting.length === 0)
          return simpleError(
            "count",
            "The randomized shelf sequence cannot fit all motifs; another arrangement may fit.",
            "no_fit",
          );
        const m = pick(fitting, random);
        placements.push({
          motifId: m.id,
          index: placements.length,
          x: finite(x.margin + cx),
          y: finite(x.margin + cy),
          width: m.width,
          height: m.height,
          area: area(m.width, m.height),
        });
        cx = finite(cx + m.width + x.gap);
        rowHeight = Math.max(rowHeight, m.height);
      }
      return {
        placements,
        clothArea,
        motifArea: finite(placements.reduce((s, p) => s + p.area, 0)),
      };
    },
  );
export const embroideryMotifPlacementExample = {
  input: {
    width: 6,
    height: 4,
    margin: 0,
    gap: 1,
    count: 2,
    motifs: [{ id: "leaf", width: 2, height: 2 }],
    seed: 42,
  },
  output: {
    placements: [
      { motifId: "leaf", index: 0, x: 0, y: 0, width: 2, height: 2, area: 4 },
      { motifId: "leaf", index: 1, x: 3, y: 0, width: 2, height: 2, area: 4 },
    ],
    clothArea: 24,
    motifArea: 8,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  EmbroideryMotifPlacementInput,
  EmbroideryMotifPlacementOutput
>;
export const embroideryMotifPlacementTool = createModelDefinition<
  EmbroideryMotifPlacementInput,
  EmbroideryMotifPlacementOutput
>({
  id: "random/embroidery-motif-placement",
  title: "Random Embroidery Motif Placement Plan Generator",
  description:
    "Place supplied motif boxes on cloth using a bounded random shelf policy with margins and gaps; failure is policy-specific, and stitch technique and hoop deformation are excluded.",
  inputSchema,
  outputSchema,
  execute: calculateEmbroideryMotifPlacement,
});
export const runEmbroideryMotifPlacement = embroideryMotifPlacementTool.execute;
export default embroideryMotifPlacementTool;
