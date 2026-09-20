import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  integer,
  object,
  run,
  pick,
  limit,
  simpleError,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import {
  point,
  rotate,
  bounds,
  clipSegment,
  pointSchema,
  boxSchema,
  type Segment,
  type Point,
  type Box,
} from "../m500b-art-craft-geometry.js";
export type MirrorKaleidoscopeLayoutInput = AcSeed & {
  readonly motif: readonly Point[];
  readonly sectorOptions: readonly number[];
  readonly clipHalfSize: number;
};
export type MirrorKaleidoscopeLayoutOutput = AcReplay & {
  readonly sectorCount: number;
  readonly segments: readonly (Segment & { readonly sector: number })[];
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  motif: array(pointSchema, 32, 2),
  sectorOptions: array(
    { type: "integer", enum: [2, 4, 6, 8, 10, 12, 14, 16] },
    8,
    1,
  ),
  clipHalfSize: positive,
});
export const outputSchema = outputObject({
  sectorCount: integer(2, 16),
  segments: array(
    object({ sector: integer(0, 15), from: pointSchema, to: pointSchema }),
    128,
  ),
  bounds: boxSchema,
});
const isInput = (v: unknown): v is MirrorKaleidoscopeLayoutInput =>
  matchesModelInput(v, inputSchema);
export const calculateMirrorKaleidoscopeLayout = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<MirrorKaleidoscopeLayoutOutput, "randomness"> => {
      limit(x.motif.length * Math.max(...x.sectorOptions));
      const max = Math.max(...x.sectorOptions);
      for (const [a, b] of x.motif) {
        const turns = Math.atan2(b, a) / (2 * Math.PI);
        if (turns < 0 || turns > 1 / max)
          return simpleError(
            "motif",
            "Motif vertices must lie inside every selectable fundamental wedge.",
            "outside_wedge",
          );
      }
      const sectorCount = pick(x.sectorOptions, random),
        rect = {
          x: -x.clipHalfSize,
          y: -x.clipHalfSize,
          width: 2 * x.clipHalfSize,
          height: 2 * x.clipHalfSize,
        },
        segments: (Segment & { sector: number })[] = [];
      for (let sector = 0; sector < sectorCount; sector++) {
        const points = x.motif.map(([a, b]) =>
          rotate(
            point(a, sector % 2 ? -b : b),
            (sector + (sector % 2)) / sectorCount,
          ),
        );
        for (let i = 1; i < points.length; i++) {
          const s = clipSegment({ from: points[i - 1], to: points[i] }, rect);
          if (s) segments.push({ ...s, sector });
        }
      }
      if (segments.length === 0)
        return simpleError(
          "clipHalfSize",
          "All transformed segments fall outside the clip square.",
          "empty_clip",
        );
      return {
        sectorCount,
        segments,
        bounds: bounds(segments.flatMap((s) => [s.from, s.to])),
      };
    },
  );
export const mirrorKaleidoscopeLayoutExample = {
  input: {
    motif: [
      [1, 0],
      [1, 1],
    ],
    sectorOptions: [2],
    clipHalfSize: 2,
    seed: 42,
  },
  output: {
    sectorCount: 2,
    segments: [
      { sector: 0, from: [1, 0], to: [1, 1] },
      { sector: 1, from: [1, 0], to: [1, -1] },
    ],
    bounds: { minX: 1, minY: -1, maxX: 1, maxY: 1, width: 0, height: 2 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  MirrorKaleidoscopeLayoutInput,
  MirrorKaleidoscopeLayoutOutput
>;
export const mirrorKaleidoscopeLayoutTool = createModelDefinition<
  MirrorKaleidoscopeLayoutInput,
  MirrorKaleidoscopeLayoutOutput
>({
  id: "random/mirror-kaleidoscope-layout",
  title: "Random Mirror Kaleidoscope Layout Generator",
  description:
    "Reflect a supplied wedge polyline through alternating sectors and clip every transformed segment to a centered square.",
  inputSchema,
  outputSchema,
  execute: calculateMirrorKaleidoscopeLayout,
});
export const runMirrorKaleidoscopeLayout = mirrorKaleidoscopeLayoutTool.execute;
export default mirrorKaleidoscopeLayoutTool;
