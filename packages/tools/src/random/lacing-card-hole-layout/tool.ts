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
  finite,
  simpleError,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import {
  area,
  point,
  pointSchema,
  type Point,
} from "../m500b-art-craft-geometry.js";
export type LacingCardHoleLayoutInput = AcSeed & {
  readonly outline: readonly Point[];
  readonly holeCount: number;
  readonly phaseTurns: readonly number[];
  readonly minimumSpacing: number;
};
export type LacingCardHoleLayoutOutput = AcReplay & {
  readonly holes: readonly {
    readonly number: number;
    readonly point: Point;
    readonly arclength: number;
  }[];
  readonly perimeter: number;
  readonly phaseTurns: number;
  readonly minimumPairDistance: number;
  readonly boundingRectangleArea: number;
};
export const inputSchema = inputObject({
  outline: array(pointSchema, 16, 4),
  holeCount: integer(3, 64),
  phaseTurns: array({ type: "number", minimum: 0, exclusiveMaximum: 1 }, 16, 1),
  minimumSpacing: positive,
});
export const outputSchema = outputObject({
  holes: array(
    object({
      number: integer(1, 64),
      point: pointSchema,
      arclength: { type: "number", minimum: 0 },
    }),
    64,
    3,
  ),
  perimeter: positive,
  phaseTurns: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  minimumPairDistance: positive,
  boundingRectangleArea: positive,
});
const isInput = (v: unknown): v is LacingCardHoleLayoutInput =>
  matchesModelInput(v, inputSchema);
export const calculateLacingCardHoleLayout = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<LacingCardHoleLayoutOutput, "randomness"> => {
      const edges = x.outline.map((a, i) => {
        const b = x.outline[(i + 1) % x.outline.length],
          dx = finite(b[0] - a[0]),
          dy = finite(b[1] - a[1]);
        if ((dx === 0) === (dy === 0))
          return simpleError(
            "outline",
            "Use nonzero axis-aligned outline edges without repeating the closing vertex.",
            "invalid_outline",
          );
        return { a, b, dx, dy, length: finite(Math.abs(dx) + Math.abs(dy)) };
      });
      for (let i = 0; i < edges.length; i++) {
        const a = edges[i],
          b = edges[(i + 1) % edges.length];
        if (
          (a.dx === 0 && b.dx === 0 && Math.sign(a.dy) !== Math.sign(b.dy)) ||
          (a.dy === 0 && b.dy === 0 && Math.sign(a.dx) !== Math.sign(b.dx))
        )
          return simpleError(
            "outline",
            "Adjacent edges must not retrace each other.",
            "invalid_outline",
          );
        for (let j = i + 1; j < edges.length; j++) {
          if (j === i + 1 || (i === 0 && j === edges.length - 1)) continue;
          const b = edges[j],
            intersects =
              Math.max(Math.min(a.a[0], a.b[0]), Math.min(b.a[0], b.b[0])) <=
                Math.min(Math.max(a.a[0], a.b[0]), Math.max(b.a[0], b.b[0])) &&
              Math.max(Math.min(a.a[1], a.b[1]), Math.min(b.a[1], b.b[1])) <=
                Math.min(Math.max(a.a[1], a.b[1]), Math.max(b.a[1], b.b[1]));
          if (intersects)
            return simpleError(
              "outline",
              "Nonadjacent outline edges must not touch or cross.",
              "self_intersection",
            );
        }
      }
      const perimeter = finite(edges.reduce((s, e) => s + e.length, 0)),
        phaseTurns = finite(pick(x.phaseTurns, random)),
        step = perimeter / x.holeCount;
      const holes = Array.from({ length: x.holeCount }, (_, i) => {
        const arclength = finite(
          finite(phaseTurns * perimeter + i * step) % perimeter,
        );
        let remaining = arclength;
        for (const e of edges) {
          if (remaining <= e.length)
            return {
              number: i + 1,
              point: point(
                e.a[0] + Math.sign(e.dx) * remaining,
                e.a[1] + Math.sign(e.dy) * remaining,
              ),
              arclength,
            };
          remaining -= e.length;
        }
        throw new Error("Perimeter traversal exceeded a closed outline.");
      });
      let minimumPairDistance = Infinity;
      for (let i = 0; i < holes.length; i++)
        for (let j = i + 1; j < holes.length; j++)
          minimumPairDistance = Math.min(
            minimumPairDistance,
            Math.hypot(
              finite(holes[i].point[0] - holes[j].point[0]),
              finite(holes[i].point[1] - holes[j].point[1]),
            ),
          );
      if (minimumPairDistance < x.minimumSpacing)
        return simpleError(
          "minimumSpacing",
          "The selected equal-arclength phase violates Euclidean hole spacing; other phases are not searched.",
          "spacing_violation",
        );
      const xs = x.outline.map((p) => p[0]),
        ys = x.outline.map((p) => p[1]),
        boundingRectangleArea = area(
          finite(Math.max(...xs) - Math.min(...xs)),
          finite(Math.max(...ys) - Math.min(...ys)),
        );
      return {
        holes,
        perimeter,
        phaseTurns,
        minimumPairDistance: finite(minimumPairDistance),
        boundingRectangleArea,
      };
    },
  );
export const lacingCardHoleLayoutExample = {
  input: {
    outline: [
      [0, 0],
      [4, 0],
      [4, 2],
      [0, 2],
    ],
    holeCount: 4,
    phaseTurns: [0],
    minimumSpacing: 2,
    seed: 42,
  },
  output: {
    holes: [
      { number: 1, point: [0, 0], arclength: 0 },
      { number: 2, point: [3, 0], arclength: 3 },
      { number: 3, point: [4, 2], arclength: 6 },
      { number: 4, point: [1, 2], arclength: 9 },
    ],
    perimeter: 12,
    phaseTurns: 0,
    minimumPairDistance: 2.23606797749979,
    boundingRectangleArea: 8,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<LacingCardHoleLayoutInput, LacingCardHoleLayoutOutput>;
export const lacingCardHoleLayoutTool = createModelDefinition<
  LacingCardHoleLayoutInput,
  LacingCardHoleLayoutOutput
>({
  id: "random/lacing-card-hole-layout",
  title: "Random Lacing Card Hole Layout Generator",
  description:
    "Number equally spaced perimeter holes on a supplied simple orthogonal outline, sample a phase and verify every Euclidean pair distance; material safety and physical usability remain caller-reviewed.",
  inputSchema,
  outputSchema,
  execute: calculateLacingCardHoleLayout,
});
export const runLacingCardHoleLayout = lacingCardHoleLayoutTool.execute;
export default lacingCardHoleLayoutTool;
