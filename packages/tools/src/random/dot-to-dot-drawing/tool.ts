import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculatePolylineLength } from "../../geometry/polyline-length/tool.js";
import {
  calculateBoundingBox,
  type BoundingBoxOutput,
} from "../../geometry/bounding-box/tool.js";
import {
  fcArray,
  fcBoolean,
  fcFinite,
  fcInput,
  fcInteger,
  fcNumber,
  fcObject,
  fcOutput,
  fcRun,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type DrawingPoint = { readonly x: number; readonly y: number };
export type DotToDotDrawingInput = FcSeed & {
  readonly outline: readonly DrawingPoint[];
  readonly closed: boolean;
  readonly count: number;
  readonly jitterFraction: number;
};
export type DotToDotDrawingOutput = FcReplay & {
  readonly closed: boolean;
  readonly points: readonly {
    readonly number: number;
    readonly x: number;
    readonly y: number;
    readonly arcLength: number;
    readonly segmentIndex: number;
  }[];
  readonly outlineLength: number;
  readonly drawingLength: number;
  readonly boundingBox: BoundingBoxOutput;
};
const pointSchema = fcObject({ x: fcNumber, y: fcNumber });
export const inputSchema = fcInput({
  outline: fcArray(pointSchema, 128, 2),
  closed: fcBoolean,
  count: fcInteger(2, 256),
  jitterFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
});
export const outputSchema = fcOutput({
  closed: fcBoolean,
  points: fcArray(
    fcObject({
      number: fcInteger(1, 256),
      x: fcNumber,
      y: fcNumber,
      arcLength: fcNumber,
      segmentIndex: fcInteger(0, 127),
    }),
    256,
    2,
  ),
  outlineLength: fcNumber,
  drawingLength: fcNumber,
  boundingBox: fcObject({
    minX: fcNumber,
    minY: fcNumber,
    maxX: fcNumber,
    maxY: fcNumber,
    width: fcNumber,
    height: fcNumber,
  }),
});
const isInput = (v: unknown): v is DotToDotDrawingInput =>
  matchesModelInput(v, inputSchema);
const length = (points: readonly DrawingPoint[], field: string): number =>
  fcFinite(
    calculatePolylineLength({
      xs: points.map((p) => p.x),
      ys: points.map((p) => p.y),
    }).length,
    field,
  );
export const calculateDotToDotDrawing = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<DotToDotDrawingOutput, "randomness"> => {
      const vertices = x.closed ? [...x.outline, x.outline[0]] : [...x.outline],
        lengths = vertices
          .slice(1)
          .map((v, i) => length([vertices[i], v], "outline"));
      const outlineLength = fcFinite(
        lengths.reduce((s, d) => s + d, 0),
        "outline",
      );
      if (outlineLength <= 0)
        simpleError(
          "outline",
          "The supplied outline must have positive representable length.",
          "degenerate_outline",
        );
      let previous = -1;
      const points = Array.from({ length: x.count }, (_, i) => {
        const u = random.unit(),
          fixed = i === 0 || (!x.closed && i === x.count - 1);
        const fraction =
            (i + (fixed ? 0 : (u - 0.5) * x.jitterFraction)) /
            (x.closed ? x.count : x.count - 1),
          arcLength = outlineLength * fraction;
        if (arcLength <= previous || (x.closed && arcLength >= outlineLength))
          simpleError(
            "count",
            "Waypoint spacing is below floating-point resolution.",
            "numeric_resolution",
          );
        previous = arcLength;
        let segmentIndex = 0,
          offset = arcLength;
        while (
          segmentIndex < lengths.length - 1 &&
          (lengths[segmentIndex] === 0 || offset > lengths[segmentIndex])
        ) {
          offset -= lengths[segmentIndex];
          segmentIndex++;
        }
        if (lengths[segmentIndex] === 0) {
          while (segmentIndex > 0 && lengths[segmentIndex] === 0)
            segmentIndex--;
          offset = lengths[segmentIndex];
        }
        const a = vertices[segmentIndex],
          b = vertices[segmentIndex + 1],
          t = Math.min(1, offset / lengths[segmentIndex]);
        const endpoint =
          !x.closed && i === x.count - 1
            ? x.outline[x.outline.length - 1]
            : null;
        return {
          number: i + 1,
          x: endpoint ? endpoint.x : fcFinite(a.x + (b.x - a.x) * t, "outline"),
          y: endpoint ? endpoint.y : fcFinite(a.y + (b.y - a.y) * t, "outline"),
          arcLength,
          segmentIndex,
        };
      });
      const boundingBox = calculateBoundingBox({
        points: points.map((p) => [p.x, p.y]),
      });
      for (const value of Object.values(boundingBox))
        fcFinite(value, "outline");
      const drawingLength = length(
        x.closed ? [...points, points[0]] : points,
        "outline",
      );
      return {
        closed: x.closed,
        points,
        outlineLength,
        drawingLength,
        boundingBox,
      };
    },
  );
export const dotToDotDrawingExample = {
  input: {
    outline: [
      { x: 0, y: 0 },
      { x: 3, y: 0 },
      { x: 3, y: 4 },
    ],
    closed: false,
    count: 3,
    jitterFraction: 0,
    seed: 42,
  },
  output: {
    closed: false,
    points: [
      { number: 1, x: 0, y: 0, arcLength: 0, segmentIndex: 0 },
      { number: 2, x: 3, y: 0.5, arcLength: 3.5, segmentIndex: 1 },
      { number: 3, x: 3, y: 4, arcLength: 7, segmentIndex: 1 },
    ],
    outlineLength: 7,
    drawingLength: 6.541381265149109,
    boundingBox: { minX: 0, minY: 0, maxX: 3, maxY: 4, width: 3, height: 4 },
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<DotToDotDrawingInput, DotToDotDrawingOutput>;
export const dotToDotDrawingTool = createModelDefinition<
  DotToDotDrawingInput,
  DotToDotDrawingOutput
>({
  id: "random/dot-to-dot-drawing",
  title: "Random Dot-to-Dot Drawing Generator",
  description:
    "Place numbered waypoints along a supplied open or closed outline with order-preserving arc-length jitter, explicit endpoints, and geometric evidence.",
  inputSchema,
  outputSchema,
  execute: calculateDotToDotDrawing,
});
export const runDotToDotDrawing = dotToDotDrawingTool.execute;
export default dotToDotDrawingTool;
