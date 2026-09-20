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
  pick,
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
export type LissajousCurveSetInput = AcSeed & {
  readonly count: number;
  readonly minimumFrequency: number;
  readonly maximumFrequency: number;
  readonly phaseTurns: readonly number[];
  readonly amplitudeX: number;
  readonly amplitudeY: number;
  readonly intervals: number;
};
export type LissajousCurveSetOutput = AcReplay & {
  readonly curves: readonly {
    readonly frequencyX: number;
    readonly frequencyY: number;
    readonly phaseTurns: number;
    readonly points: readonly Point[];
    readonly bounds: Box;
  }[];
};
export const inputSchema = inputObject({
  count: integer(1, 16),
  minimumFrequency: integer(1, 32),
  maximumFrequency: integer(1, 32),
  phaseTurns: array(num, 16, 1),
  amplitudeX: positive,
  amplitudeY: positive,
  intervals: integer(4, 127),
});
export const outputSchema = outputObject({
  curves: array(
    object({
      frequencyX: integer(1, 32),
      frequencyY: integer(1, 32),
      phaseTurns: num,
      points: pointsSchema,
      bounds: boxSchema,
    }),
    16,
    1,
  ),
});
const isInput = (v: unknown): v is LissajousCurveSetInput =>
  matchesModelInput(v, inputSchema);
export const calculateLissajousCurveSet = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<LissajousCurveSetOutput, "randomness"> => {
      ordered(x.minimumFrequency, x.maximumFrequency, "maximumFrequency");
      limit(x.count * (x.intervals + 1));
      const curves = Array.from({ length: x.count }, () => {
        const frequencyX = random.integer(
            x.minimumFrequency,
            x.maximumFrequency,
          ),
          frequencyY = random.integer(x.minimumFrequency, x.maximumFrequency),
          phaseTurns = finite(pick(x.phaseTurns, random));
        const points = Array.from({ length: x.intervals + 1 }, (_, i) => {
          const t = i === x.intervals ? 0 : i / x.intervals;
          return point(
            x.amplitudeX * trig(frequencyX * t + phaseTurns)[1],
            x.amplitudeY * trig(frequencyY * t)[1],
          );
        });
        return {
          frequencyX,
          frequencyY,
          phaseTurns,
          points,
          bounds: bounds(points),
        };
      });
      return { curves };
    },
  );
export const lissajousCurveSetExample = {
  input: {
    count: 1,
    minimumFrequency: 1,
    maximumFrequency: 1,
    phaseTurns: [0],
    amplitudeX: 2,
    amplitudeY: 3,
    intervals: 4,
    seed: 42,
  },
  output: {
    curves: [
      {
        frequencyX: 1,
        frequencyY: 1,
        phaseTurns: 0,
        points: [
          [0, 0],
          [2, 3],
          [0, 0],
          [-2, -3],
          [0, 0],
        ],
        bounds: { minX: -2, minY: -3, maxX: 2, maxY: 3, width: 4, height: 6 },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<LissajousCurveSetInput, LissajousCurveSetOutput>;
export const lissajousCurveSetTool = createModelDefinition<
  LissajousCurveSetInput,
  LissajousCurveSetOutput
>({
  id: "random/lissajous-curve-set",
  title: "Random Lissajous Curve Set Generator",
  description:
    "Draw integer-frequency Lissajous parameters and sample a complete turn with exact closure and sampled bounds, without audio synthesis.",
  inputSchema,
  outputSchema,
  execute: calculateLissajousCurveSet,
});
export const runLissajousCurveSet = lissajousCurveSetTool.execute;
export default lissajousCurveSetTool;
