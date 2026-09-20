import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  num,
  integer,
  object,
  run,
  pick,
  limit,
  finite,
  simpleError,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import {
  point,
  bounds,
  hatchRange,
  hatches,
  rectSchema,
  pointSchema,
  boxSchema,
  type Rect,
  type Segment,
  type Box,
} from "../m500b-art-craft-geometry.js";
export type GeometricHatchingPatchworkInput = AcSeed & {
  readonly outline: Rect;
  readonly rows: number;
  readonly columns: number;
  readonly angles: readonly number[];
  readonly spacings: readonly number[];
};
export type GeometricHatchingPatchworkOutput = AcReplay & {
  readonly patches: readonly {
    readonly rect: Rect;
    readonly angle: number;
    readonly spacing: number;
    readonly lines: readonly Segment[];
  }[];
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  outline: rectSchema,
  rows: integer(1, 8),
  columns: integer(1, 8),
  angles: array(num, 16, 1),
  spacings: array(positive, 16, 1),
});
export const outputSchema = outputObject({
  patches: array(
    object({
      rect: rectSchema,
      angle: num,
      spacing: positive,
      lines: array(object({ from: pointSchema, to: pointSchema })),
    }),
    32,
    1,
  ),
  bounds: boxSchema,
});
const isInput = (v: unknown): v is GeometricHatchingPatchworkInput =>
  matchesModelInput(v, inputSchema);
export const calculateGeometricHatchingPatchwork = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<GeometricHatchingPatchworkOutput, "randomness"> => {
      limit(x.rows * x.columns, 32);
      const patches: Array<{
        rect: Rect;
        angle: number;
        spacing: number;
        lines: Segment[];
      }> = [];
      let lineCount = 0;
      for (let r = 0; r < x.rows; r++)
        for (let c = 0; c < x.columns; c++) {
          const x0 = finite(x.outline.x + (c / x.columns) * x.outline.width),
            y0 = finite(x.outline.y + (r / x.rows) * x.outline.height),
            x1 = finite(x.outline.x + ((c + 1) / x.columns) * x.outline.width),
            y1 = finite(x.outline.y + ((r + 1) / x.rows) * x.outline.height);
          if (x1 <= x0 || y1 <= y0)
            return simpleError(
              "outline",
              "A patch split is below coordinate resolution.",
              "numeric_resolution",
            );
          const rect = {
              x: x0,
              y: y0,
              width: finite(x1 - x0),
              height: finite(y1 - y0),
            },
            angle = finite(pick(x.angles, random)),
            spacing = pick(x.spacings, random),
            [a, b] = hatchRange(rect, angle, spacing, 0);
          lineCount += Math.max(0, b - a + 1);
          limit(lineCount);
          patches.push({ rect, angle, spacing, lines: [] });
        }
      for (const p of patches) p.lines = hatches(p.rect, p.angle, p.spacing);
      return {
        patches,
        bounds: bounds([
          point(x.outline.x, x.outline.y),
          point(x.outline.x + x.outline.width, x.outline.y + x.outline.height),
        ]),
      };
    },
  );
export const geometricHatchingPatchworkExample = {
  input: {
    outline: { x: 0, y: 0, width: 4, height: 2 },
    rows: 1,
    columns: 2,
    angles: [0],
    spacings: [1],
    seed: 42,
  },
  output: {
    patches: [
      {
        rect: { x: 0, y: 0, width: 2, height: 2 },
        angle: 0,
        spacing: 1,
        lines: [
          { from: [0, 0], to: [2, 0] },
          { from: [0, 1], to: [2, 1] },
          { from: [0, 2], to: [2, 2] },
        ],
      },
      {
        rect: { x: 2, y: 0, width: 2, height: 2 },
        angle: 0,
        spacing: 1,
        lines: [
          { from: [2, 0], to: [4, 0] },
          { from: [2, 1], to: [4, 1] },
          { from: [2, 2], to: [4, 2] },
        ],
      },
    ],
    bounds: { minX: 0, minY: 0, maxX: 4, maxY: 2, width: 4, height: 2 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  GeometricHatchingPatchworkInput,
  GeometricHatchingPatchworkOutput
>;
export const geometricHatchingPatchworkTool = createModelDefinition<
  GeometricHatchingPatchworkInput,
  GeometricHatchingPatchworkOutput
>({
  id: "random/geometric-hatching-patchwork",
  title: "Random Geometric Hatching Patchwork Generator",
  description:
    "Partition a caller-supplied rectangular outline into grid patches and clip selected angle/spacing hatches to every patch boundary.",
  inputSchema,
  outputSchema,
  execute: calculateGeometricHatchingPatchwork,
});
export const runGeometricHatchingPatchwork =
  geometricHatchingPatchworkTool.execute;
export default geometricHatchingPatchworkTool;
