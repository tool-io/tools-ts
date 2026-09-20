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
  ordered,
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
  rotate,
  bounds,
  pointsSchema,
  boxSchema,
  type Point,
  type Box,
} from "../m500b-art-craft-geometry.js";
export type RadialRosettePatternInput = AcSeed & {
  readonly radii: readonly number[];
  readonly order: number;
  readonly jitter: number;
};
export type RadialRosettePatternOutput = AcReplay & {
  readonly baseRadii: readonly number[];
  readonly points: readonly Point[];
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  radii: array(positive, 16, 1),
  order: integer(2, 16),
  jitter: nonnegative,
});
export const outputSchema = outputObject({
  baseRadii: array(positive, 16, 1),
  points: pointsSchema,
  bounds: boxSchema,
});
const isInput = (v: unknown): v is RadialRosettePatternInput =>
  matchesModelInput(v, inputSchema);
export const calculateRadialRosettePattern = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<RadialRosettePatternOutput, "randomness"> => {
      limit(x.radii.length * x.order);
      if (x.radii.some((r) => x.jitter >= r))
        return simpleError(
          "jitter",
          "Jitter must be smaller than every radius.",
          "invalid_jitter",
        );
      const baseRadii = x.radii.map((r) => {
        ordered(0, r, "radii");
        return finite(r + (random.unit() * 2 - 1) * x.jitter, "radii");
      });
      const points = Array.from({ length: x.order }, (_, sector) =>
        baseRadii.map((r, i) =>
          rotate(
            point(r, 0),
            sector / x.order + i / (x.order * baseRadii.length),
          ),
        ),
      ).flat();
      return { baseRadii, points, bounds: bounds(points) };
    },
  );
export const radialRosettePatternExample = {
  input: { radii: [2], order: 4, jitter: 0, seed: 42 },
  output: {
    baseRadii: [2],
    points: [
      [2, 0],
      [0, 2],
      [-2, 0],
      [0, -2],
    ],
    bounds: { minX: -2, minY: -2, maxX: 2, maxY: 2, width: 4, height: 4 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<RadialRosettePatternInput, RadialRosettePatternOutput>;
export const radialRosettePatternTool = createModelDefinition<
  RadialRosettePatternInput,
  RadialRosettePatternOutput
>({
  id: "random/radial-rosette-pattern",
  title: "Random Radial Rosette Pattern Generator",
  description:
    "Construct a rotationally symmetric radial motif with shared base jitter and sampled coordinate bounds; rendering is external.",
  inputSchema,
  outputSchema,
  execute: calculateRadialRosettePattern,
});
export const runRadialRosettePattern = radialRosettePatternTool.execute;
export default radialRosettePatternTool;
