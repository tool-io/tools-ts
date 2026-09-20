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
  label,
  run,
  pick,
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
  rotate,
  bounds,
  overlap,
  pointSchema,
  pointsSchema,
  boxSchema,
  type Point,
  type Box,
} from "../m500b-art-craft-geometry.js";
export type PolygonBurstCompositionInput = AcSeed & {
  readonly center: Point;
  readonly offsets: readonly Point[];
  readonly motifs: readonly {
    readonly id: string;
    readonly vertices: readonly Point[];
  }[];
  readonly scales: readonly number[];
  readonly rotations: readonly number[];
};
export type PolygonBurstCompositionOutput = AcReplay & {
  readonly layers: readonly {
    readonly motifId: string;
    readonly scale: number;
    readonly rotation: number;
    readonly points: readonly Point[];
    readonly bounds: Box;
  }[];
  readonly boundingBoxOverlapPairs: readonly (readonly [number, number])[];
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  center: pointSchema,
  offsets: array(pointSchema, 16, 1),
  motifs: array(
    object({ id: label, vertices: array(pointSchema, 16, 3) }),
    16,
    1,
  ),
  scales: array(positive, 16, 1),
  rotations: array(num, 16, 1),
});
export const outputSchema = outputObject({
  layers: array(
    object({
      motifId: label,
      scale: positive,
      rotation: num,
      points: pointsSchema,
      bounds: boxSchema,
    }),
    16,
    1,
  ),
  boundingBoxOverlapPairs: array(array(integer(0, 15), 2, 2), 120),
  bounds: boxSchema,
});
const isInput = (v: unknown): v is PolygonBurstCompositionInput =>
  matchesModelInput(v, inputSchema);
export const calculatePolygonBurstComposition = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<PolygonBurstCompositionOutput, "randomness"> => {
      distinct(
        x.motifs.map((m) => m.id),
        "motifs",
      );
      limit(
        x.offsets.length * Math.max(...x.motifs.map((m) => m.vertices.length)),
      );
      const layers = x.offsets.map((offset) => {
        const motif = pick(x.motifs, random),
          scale = pick(x.scales, random),
          rotation = finite(pick(x.rotations, random)),
          points = motif.vertices.map((v) => {
            const p = rotate(point(v[0] * scale, v[1] * scale), rotation);
            return point(
              x.center[0] + offset[0] + p[0],
              x.center[1] + offset[1] + p[1],
            );
          });
        return {
          motifId: motif.id,
          scale,
          rotation,
          points,
          bounds: bounds(points),
        };
      });
      const boundingBoxOverlapPairs: [number, number][] = [];
      for (let i = 0; i < layers.length; i++)
        for (let j = i + 1; j < layers.length; j++) {
          const a = layers[i].bounds,
            b = layers[j].bounds;
          if (
            overlap(
              { x: a.minX, y: a.minY, width: a.width, height: a.height },
              { x: b.minX, y: b.minY, width: b.width, height: b.height },
            )
          )
            boundingBoxOverlapPairs.push([i, j]);
        }
      return {
        layers,
        boundingBoxOverlapPairs,
        bounds: bounds(layers.flatMap((l) => l.points)),
      };
    },
  );
export const polygonBurstCompositionExample = {
  input: {
    center: [1, 2],
    offsets: [[0, 0]],
    motifs: [
      {
        id: "triangle",
        vertices: [
          [0, 0],
          [2, 0],
          [0, 1],
        ],
      },
    ],
    scales: [2],
    rotations: [0],
    seed: 42,
  },
  output: {
    layers: [
      {
        motifId: "triangle",
        scale: 2,
        rotation: 0,
        points: [
          [1, 2],
          [5, 2],
          [1, 4],
        ],
        bounds: { minX: 1, minY: 2, maxX: 5, maxY: 4, width: 4, height: 2 },
      },
    ],
    boundingBoxOverlapPairs: [],
    bounds: { minX: 1, minY: 2, maxX: 5, maxY: 4, width: 4, height: 2 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  PolygonBurstCompositionInput,
  PolygonBurstCompositionOutput
>;
export const polygonBurstCompositionTool = createModelDefinition<
  PolygonBurstCompositionInput,
  PolygonBurstCompositionOutput
>({
  id: "random/polygon-burst-composition",
  title: "Random Polygon Burst Composition Generator",
  description:
    "Transform supplied polygon motifs into offset layers around a center with sampled scales, rotations and explicit bounding-box overlap tags.",
  inputSchema,
  outputSchema,
  execute: calculatePolygonBurstComposition,
});
export const runPolygonBurstComposition = polygonBurstCompositionTool.execute;
export default polygonBurstCompositionTool;
