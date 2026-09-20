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
  run,
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
export type ArtOscillator = {
  readonly amplitude: number;
  readonly frequency: number;
  readonly phaseTurns: number;
  readonly damping: number;
};
export type HarmonographCurveArtInput = AcSeed & {
  readonly xOscillators: readonly ArtOscillator[];
  readonly yOscillators: readonly ArtOscillator[];
  readonly duration: number;
  readonly intervals: number;
};
export type HarmonographCurveArtOutput = AcReplay & {
  readonly xOscillator: ArtOscillator;
  readonly yOscillator: ArtOscillator;
  readonly points: readonly Point[];
  readonly bounds: Box;
};
const oscillator = object({
  amplitude: positive,
  frequency: nonnegative,
  phaseTurns: num,
  damping: nonnegative,
});
export const inputSchema = inputObject({
  xOscillators: array(oscillator, 16, 1),
  yOscillators: array(oscillator, 16, 1),
  duration: positive,
  intervals: integer(2, 127),
});
export const outputSchema = outputObject({
  xOscillator: oscillator,
  yOscillator: oscillator,
  points: pointsSchema,
  bounds: boxSchema,
});
const isInput = (v: unknown): v is HarmonographCurveArtInput =>
  matchesModelInput(v, inputSchema);
export const calculateHarmonographCurveArt = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<HarmonographCurveArtOutput, "randomness"> => {
      const normalize = (o: ArtOscillator): ArtOscillator => ({
        ...o,
        frequency: finite(o.frequency),
        phaseTurns: finite(o.phaseTurns),
        damping: finite(o.damping),
      });
      const xOscillator = normalize(pick(x.xOscillators, random)),
        yOscillator = normalize(pick(x.yOscillators, random));
      const sample = (o: ArtOscillator, t: number): number =>
        finite(
          o.amplitude *
            trig(finite(o.frequency * t + o.phaseTurns))[1] *
            Math.exp(-finite(o.damping * t)),
        );
      const points = Array.from({ length: x.intervals + 1 }, (_, i) => {
        const t = (i / x.intervals) * x.duration;
        return point(sample(xOscillator, t), sample(yOscillator, t));
      });
      return {
        xOscillator: { ...xOscillator },
        yOscillator: { ...yOscillator },
        points,
        bounds: bounds(points),
      };
    },
  );
export const harmonographCurveArtExample = {
  input: {
    xOscillators: [{ amplitude: 2, frequency: 1, phaseTurns: 0, damping: 0 }],
    yOscillators: [{ amplitude: 3, frequency: 1, phaseTurns: 0, damping: 0 }],
    duration: 1,
    intervals: 4,
    seed: 42,
  },
  output: {
    xOscillator: { amplitude: 2, frequency: 1, phaseTurns: 0, damping: 0 },
    yOscillator: { amplitude: 3, frequency: 1, phaseTurns: 0, damping: 0 },
    points: [
      [0, 0],
      [2, 3],
      [0, 0],
      [-2, -3],
      [0, 0],
    ],
    bounds: { minX: -2, minY: -3, maxX: 2, maxY: 3, width: 4, height: 6 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<HarmonographCurveArtInput, HarmonographCurveArtOutput>;
export const harmonographCurveArtTool = createModelDefinition<
  HarmonographCurveArtInput,
  HarmonographCurveArtOutput
>({
  id: "random/harmonograph-curve-art",
  title: "Random Harmonograph Curve Artwork Generator",
  description:
    "Choose damped sinusoidal axis parameters and sample a bounded two-oscillator harmonograph in caller time units; this is illustrative geometry, not an apparatus design.",
  inputSchema,
  outputSchema,
  execute: calculateHarmonographCurveArt,
});
export const runHarmonographCurveArt = harmonographCurveArtTool.execute;
export default harmonographCurveArtTool;
