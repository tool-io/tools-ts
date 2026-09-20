import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  num,
  integer,
  object,
  bool,
  run,
  ordered,
  limit,
  distinct,
  finite,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import {
  point,
  bounds,
  pointSchema,
  boxSchema,
  type Point,
  type Box,
} from "../m500b-art-craft-geometry.js";
export type ContourLineArtFieldInput = AcSeed & {
  readonly rows: number;
  readonly columns: number;
  readonly minimumHeight: number;
  readonly maximumHeight: number;
  readonly levels: readonly number[];
};
export type ContourLineArtFieldOutput = AcReplay & {
  readonly grid: readonly (readonly number[])[];
  readonly paths: readonly {
    readonly level: number;
    readonly closed: boolean;
    readonly points: readonly Point[];
  }[];
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  rows: integer(2, 8),
  columns: integer(2, 8),
  minimumHeight: integer(-128, 128),
  maximumHeight: integer(-128, 128),
  levels: array(num, 4, 1),
});
export const outputSchema = outputObject({
  grid: array(array(num, 8, 2), 8, 2),
  paths: array(
    object({ level: num, closed: bool, points: array(pointSchema, 512, 2) }),
    512,
  ),
  bounds: boxSchema,
});
const isInput = (v: unknown): v is ContourLineArtFieldInput =>
  matchesModelInput(v, inputSchema);
export const calculateContourLineArtField = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<ContourLineArtFieldOutput, "randomness"> => {
      ordered(x.minimumHeight, x.maximumHeight, "maximumHeight");
      distinct(x.levels.map(String), "levels");
      limit(x.rows * x.columns, 64);
      const heights = Array.from({ length: x.rows * x.columns }, () =>
          random.integer(x.minimumHeight, x.maximumHeight),
        ),
        grid = Array.from({ length: x.rows }, (_, r) =>
          heights.slice(r * x.columns, (r + 1) * x.columns),
        );
      const xy = (id: number): Point =>
        point(id % x.columns, Math.floor(id / x.columns));
      const paths: ContourLineArtFieldOutput["paths"][number][] = [];
      for (const rawLevel of x.levels) {
        const level = finite(rawLevel);
        const segments: { a: string; b: string; from: Point; to: Point }[] = [];
        for (let r = 0; r < x.rows - 1; r++)
          for (let c = 0; c < x.columns - 1; c++) {
            const a = r * x.columns + c,
              b = a + 1,
              d = a + x.columns,
              e = d + 1;
            for (const triangle of [
              [a, b, e],
              [a, e, d],
            ]) {
              const hits: { key: string; p: Point }[] = [];
              for (let i = 0; i < 3; i++) {
                let u = triangle[i],
                  v = triangle[(i + 1) % 3];
                if (u > v) [u, v] = [v, u];
                const hu = heights[u],
                  hv = heights[v];
                if (hu >= level === hv >= level) continue;
                const t = (level - hu) / (hv - hu),
                  p = xy(u),
                  q = xy(v);
                hits.push({
                  key:
                    t === 0 ? "v" + u : t === 1 ? "v" + v : "e" + u + ":" + v,
                  p: point(p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])),
                });
              }
              if (hits.length === 2 && hits[0].key !== hits[1].key)
                segments.push({
                  a: hits[0].key,
                  b: hits[1].key,
                  from: hits[0].p,
                  to: hits[1].p,
                });
            }
          }
        while (segments.length) {
          const degree = new Map<string, number>();
          for (const s of segments) {
            degree.set(s.a, (degree.get(s.a) ?? 0) + 1);
            degree.set(s.b, (degree.get(s.b) ?? 0) + 1);
          }
          const first =
            segments.find(
              (s) => degree.get(s.a) !== 2 || degree.get(s.b) !== 2,
            ) ?? segments[0];
          let key = degree.get(first.a) !== 2 ? first.a : first.b;
          const start = key,
            points: Point[] = [];
          while (true) {
            const index = segments.findIndex((s) => s.a === key || s.b === key);
            if (index < 0) break;
            const [s] = segments.splice(index, 1);
            if (points.length === 0) points.push(s.a === key ? s.from : s.to);
            points.push(s.a === key ? s.to : s.from);
            key = s.a === key ? s.b : s.a;
            if (key === start) break;
          }
          paths.push({ level, closed: key === start, points });
        }
      }
      return {
        grid,
        paths,
        bounds: bounds([point(0, 0), point(x.columns - 1, x.rows - 1)]),
      };
    },
  );
export const contourLineArtFieldExample = {
  input: {
    rows: 2,
    columns: 2,
    minimumHeight: 0,
    maximumHeight: 1,
    levels: [0.5],
    seed: 42,
  },
  output: {
    grid: [
      [1, 0],
      [1, 1],
    ],
    paths: [
      {
        level: 0.5,
        closed: false,
        points: [
          [0.5, 0],
          [1, 0.5],
        ],
      },
    ],
    bounds: { minX: 0, minY: 0, maxX: 1, maxY: 1, width: 1, height: 1 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<ContourLineArtFieldInput, ContourLineArtFieldOutput>;
export const contourLineArtFieldTool = createModelDefinition<
  ContourLineArtFieldInput,
  ContourLineArtFieldOutput
>({
  id: "random/contour-line-art-field",
  title: "Random Contour Line Art Field Generator",
  description:
    "Generate illustrative heights and joined piecewise-linear contour trails on diagonal triangles; equality uses the high side and vertex junctions follow triangle order, not terrain-survey semantics.",
  inputSchema,
  outputSchema,
  execute: calculateContourLineArtField,
});
export const runContourLineArtField = contourLineArtFieldTool.execute;
export default contourLineArtFieldTool;
