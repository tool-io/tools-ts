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
  ordered,
  limit,
  simpleError,
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
export type SpirographTrochoidSetInput = AcSeed & {
  readonly count: number;
  readonly minimumFixedRadius: number;
  readonly maximumFixedRadius: number;
  readonly minimumRollingRadius: number;
  readonly maximumRollingRadius: number;
  readonly penOffset: number;
  readonly intervals: number;
};
export type SpirographTrochoidSetOutput = AcReplay & {
  readonly curves: readonly {
    readonly fixedRadius: number;
    readonly rollingRadius: number;
    readonly closureTurns: number;
    readonly points: readonly Point[];
    readonly bounds: Box;
  }[];
};
export const inputSchema = inputObject({
  count: integer(1, 16),
  minimumFixedRadius: integer(2, 128),
  maximumFixedRadius: integer(2, 128),
  minimumRollingRadius: integer(1, 127),
  maximumRollingRadius: integer(1, 127),
  penOffset: positive,
  intervals: integer(4, 127),
});
export const outputSchema = outputObject({
  curves: array(
    object({
      fixedRadius: integer(2, 128),
      rollingRadius: integer(1, 127),
      closureTurns: num,
      points: pointsSchema,
      bounds: boxSchema,
    }),
    16,
    1,
  ),
});
const isInput = (v: unknown): v is SpirographTrochoidSetInput =>
  matchesModelInput(v, inputSchema);
export const calculateSpirographTrochoidSet = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<SpirographTrochoidSetOutput, "randomness"> => {
      ordered(x.minimumFixedRadius, x.maximumFixedRadius, "maximumFixedRadius");
      ordered(
        x.minimumRollingRadius,
        x.maximumRollingRadius,
        "maximumRollingRadius",
      );
      limit(x.count * (x.intervals + 1));
      if (x.maximumRollingRadius >= x.minimumFixedRadius)
        return simpleError(
          "maximumRollingRadius",
          "Every rolling radius must be smaller than every fixed radius.",
          "invalid_radii",
        );
      const curves = Array.from({ length: x.count }, () => {
        const fixedRadius = random.integer(
            x.minimumFixedRadius,
            x.maximumFixedRadius,
          ),
          rollingRadius = random.integer(
            x.minimumRollingRadius,
            x.maximumRollingRadius,
          );
        let a = fixedRadius,
          b = rollingRadius;
        while (b) {
          const r = a % b;
          a = b;
          b = r;
        }
        const closureTurns = rollingRadius / a,
          k = (fixedRadius - rollingRadius) / rollingRadius;
        const points = Array.from({ length: x.intervals + 1 }, (_, i) => {
          const t = i === x.intervals ? 0 : (closureTurns * i) / x.intervals,
            [c, s] = trig(t),
            [u, v] = trig(k * t);
          return point(
            (fixedRadius - rollingRadius) * c + x.penOffset * u,
            (fixedRadius - rollingRadius) * s - x.penOffset * v,
          );
        });
        return {
          fixedRadius,
          rollingRadius,
          closureTurns,
          points,
          bounds: bounds(points),
        };
      });
      return { curves };
    },
  );
export const spirographTrochoidSetExample = {
  input: {
    count: 1,
    minimumFixedRadius: 4,
    maximumFixedRadius: 4,
    minimumRollingRadius: 2,
    maximumRollingRadius: 2,
    penOffset: 1,
    intervals: 4,
    seed: 42,
  },
  output: {
    curves: [
      {
        fixedRadius: 4,
        rollingRadius: 2,
        closureTurns: 1,
        points: [
          [3, 0],
          [0, 1],
          [-3, 0],
          [0, -1],
          [3, 0],
        ],
        bounds: { minX: -3, minY: -1, maxX: 3, maxY: 1, width: 6, height: 2 },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  SpirographTrochoidSetInput,
  SpirographTrochoidSetOutput
>;
export const spirographTrochoidSetTool = createModelDefinition<
  SpirographTrochoidSetInput,
  SpirographTrochoidSetOutput
>({
  id: "random/spirograph-trochoid-set",
  title: "Random Spirograph Trochoid Set Generator",
  description:
    "Sample integer-radius hypotrochoids through r/gcd(R,r) turns with exact copied endpoints and sampled bounds.",
  inputSchema,
  outputSchema,
  execute: calculateSpirographTrochoidSet,
});
export const runSpirographTrochoidSet = spirographTrochoidSetTool.execute;
export default spirographTrochoidSetTool;
