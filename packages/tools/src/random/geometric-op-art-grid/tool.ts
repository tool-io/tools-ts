import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  nonnegative,
  integer,
  run,
  limit,
  finite,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import {
  point,
  trig,
  bounds,
  pointsSchema,
  boxSchema,
  type Point,
  type Box,
} from "../m500b-art-craft-geometry.js";
export type GeometricOpArtGridInput = AcSeed & {
  readonly rows: number;
  readonly columns: number;
  readonly width: number;
  readonly height: number;
  readonly maximumDisplacement: number;
};
export type GeometricOpArtGridOutput = AcReplay & {
  readonly points: readonly Point[];
  readonly edges: readonly (readonly [number, number])[];
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  rows: integer(1, 16),
  columns: integer(1, 16),
  width: positive,
  height: positive,
  maximumDisplacement: nonnegative,
});
export const outputSchema = outputObject({
  points: pointsSchema,
  edges: array(array(integer(0, 127), 2, 2), 256),
  bounds: boxSchema,
});
const isInput = (v: unknown): v is GeometricOpArtGridInput =>
  matchesModelInput(v, inputSchema);
export const calculateGeometricOpArtGrid = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<GeometricOpArtGridOutput, "randomness"> => {
      limit((x.rows + 1) * (x.columns + 1));
      const points: Point[] = [],
        edges: [number, number][] = [];
      for (let r = 0; r <= x.rows; r++)
        for (let c = 0; c <= x.columns; c++) {
          let dx = 0,
            dy = 0;
          if (r > 0 && r < x.rows && c > 0 && c < x.columns) {
            const [u, v] = trig(random.unit()),
              m = finite(Math.sqrt(random.unit()) * x.maximumDisplacement);
            dx = u * m;
            dy = v * m;
          }
          const id = points.length;
          points.push(
            point((c / x.columns) * x.width + dx, (r / x.rows) * x.height + dy),
          );
          if (c > 0) edges.push([id - 1, id]);
          if (r > 0) edges.push([id - x.columns - 1, id]);
        }
      return { points, edges, bounds: bounds(points) };
    },
  );
export const geometricOpArtGridExample = {
  input: {
    rows: 2,
    columns: 2,
    width: 2,
    height: 2,
    maximumDisplacement: 0,
    seed: 42,
  },
  output: {
    points: [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [0, 3],
      [3, 4],
      [1, 4],
      [4, 5],
      [2, 5],
      [3, 6],
      [6, 7],
      [4, 7],
      [7, 8],
      [5, 8],
    ],
    bounds: { minX: 0, minY: 0, maxX: 2, maxY: 2, width: 2, height: 2 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<GeometricOpArtGridInput, GeometricOpArtGridOutput>;
export const geometricOpArtGridTool = createModelDefinition<
  GeometricOpArtGridInput,
  GeometricOpArtGridOutput
>({
  id: "random/geometric-op-art-grid",
  title: "Random Geometric Op Art Grid Generator",
  description:
    "Displace interior grid vertices with disk-uniform capped vectors while fixing the boundary and retaining vector edges; cells may fold and rendering is external.",
  inputSchema,
  outputSchema,
  execute: calculateGeometricOpArtGrid,
});
export const runGeometricOpArtGrid = geometricOpArtGridTool.execute;
export default geometricOpArtGridTool;
