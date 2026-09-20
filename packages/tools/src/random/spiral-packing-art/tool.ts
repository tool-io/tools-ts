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
  bool,
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
  point,
  trig,
  bounds,
  pointSchema,
  boxSchema,
  type Point,
  type Box,
} from "../m500b-art-craft-geometry.js";
export type SpiralPackingArtInput = AcSeed & {
  readonly attempts: number;
  readonly startRadius: number;
  readonly growthPerTurn: number;
  readonly stepTurns: number;
  readonly motifRadii: readonly number[];
  readonly minimumGap: number;
  readonly overlapPolicy: "allow" | "reject";
};
export type SpiralPackingArtOutput = AcReplay & {
  readonly attempts: readonly {
    readonly center: Point;
    readonly radius: number;
    readonly accepted: boolean;
    readonly blockedBy: readonly number[];
  }[];
  readonly acceptedCount: number;
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  attempts: integer(1, 64),
  startRadius: positive,
  growthPerTurn: nonnegative,
  stepTurns: positive,
  motifRadii: array(positive, 16, 1),
  minimumGap: nonnegative,
  overlapPolicy: { type: "string", enum: ["allow", "reject"] },
});
export const outputSchema = outputObject({
  attempts: array(
    object({
      center: pointSchema,
      radius: positive,
      accepted: bool,
      blockedBy: array(integer(0, 63), 64),
    }),
    64,
    1,
  ),
  acceptedCount: integer(1, 64),
  bounds: boxSchema,
});
const isInput = (v: unknown): v is SpiralPackingArtInput =>
  matchesModelInput(v, inputSchema);
export const calculateSpiralPackingArt = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<SpiralPackingArtOutput, "randomness"> => {
      const attempts: SpiralPackingArtOutput["attempts"][number][] = [],
        extents: Point[] = [];
      for (let i = 0; i < x.attempts; i++) {
        const turns = finite(i * x.stepTurns),
          r = finite(x.startRadius + x.growthPerTurn * turns),
          [c, s] = trig(turns),
          center = point(r * c, r * s),
          radius = pick(x.motifRadii, random),
          blockedBy: number[] = [];
        attempts.forEach((a, j) => {
          if (
            a.accepted &&
            Math.hypot(
              finite(center[0] - a.center[0]),
              finite(center[1] - a.center[1]),
            ) < finite(radius + a.radius + x.minimumGap)
          )
            blockedBy.push(j);
        });
        const accepted = x.overlapPolicy === "allow" || blockedBy.length === 0;
        attempts.push({ center, radius, accepted, blockedBy });
        if (accepted) {
          extents.push(
            point(center[0] - radius, center[1] - radius),
            point(center[0] + radius, center[1] + radius),
          );
        }
      }
      if (extents.length === 0)
        return simpleError("attempts", "No motif was accepted.", "no_fit");
      return {
        attempts,
        acceptedCount: attempts.filter((a) => a.accepted).length,
        bounds: bounds(extents),
      };
    },
  );
export const spiralPackingArtExample = {
  input: {
    attempts: 2,
    startRadius: 2,
    growthPerTurn: 0,
    stepTurns: 0.25,
    motifRadii: [0.5],
    minimumGap: 0,
    overlapPolicy: "reject",
    seed: 42,
  },
  output: {
    attempts: [
      { center: [2, 0], radius: 0.5, accepted: true, blockedBy: [] },
      { center: [0, 2], radius: 0.5, accepted: true, blockedBy: [] },
    ],
    acceptedCount: 2,
    bounds: {
      minX: -0.5,
      minY: -0.5,
      maxX: 2.5,
      maxY: 2.5,
      width: 3,
      height: 3,
    },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<SpiralPackingArtInput, SpiralPackingArtOutput>;
export const spiralPackingArtTool = createModelDefinition<
  SpiralPackingArtInput,
  SpiralPackingArtOutput
>({
  id: "random/spiral-packing-art",
  title: "Random Spiral Packing Artwork Generator",
  description:
    "Place random-radius circles along an Archimedean spiral with explicit overlap traces and rejection; attempt count is not guaranteed accepted count or optimal packing.",
  inputSchema,
  outputSchema,
  execute: calculateSpiralPackingArt,
});
export const runSpiralPackingArt = spiralPackingArtTool.execute;
export default spiralPackingArtTool;
