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
  limit,
  finite,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import {
  bounds,
  point,
  hatchRange,
  hatches,
  pointSchema,
  boxSchema,
  type Segment,
  type Box,
} from "../m500b-art-craft-geometry.js";
type Family = {
  readonly turns: readonly number[];
  readonly spacings: readonly number[];
  readonly offsets: readonly number[];
};
export type MoireLineInterferenceInput = AcSeed & {
  readonly width: number;
  readonly height: number;
  readonly families: readonly Family[];
};
export type MoireLineInterferenceOutput = AcReplay & {
  readonly families: readonly {
    readonly turns: number;
    readonly spacing: number;
    readonly offset: number;
  }[];
  readonly lines: readonly (Segment & { readonly family: number })[];
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  width: positive,
  height: positive,
  families: array(
    object({
      turns: array(num, 16, 1),
      spacings: array(positive, 16, 1),
      offsets: array(num, 16, 1),
    }),
    2,
    2,
  ),
});
export const outputSchema = outputObject({
  families: array(object({ turns: num, spacing: positive, offset: num }), 2, 2),
  lines: array(
    object({ family: integer(0, 1), from: pointSchema, to: pointSchema }),
  ),
  bounds: boxSchema,
});
const isInput = (v: unknown): v is MoireLineInterferenceInput =>
  matchesModelInput(v, inputSchema);
export const calculateMoireLineInterference = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<MoireLineInterferenceOutput, "randomness"> => {
      const rect = { x: 0, y: 0, width: x.width, height: x.height },
        families = x.families.map((f) => ({
          turns: finite(pick(f.turns, random)),
          spacing: pick(f.spacings, random),
          offset: finite(pick(f.offsets, random)),
        }));
      limit(
        families.reduce((sum, f) => {
          const [a, b] = hatchRange(rect, f.turns, f.spacing, f.offset);
          return sum + Math.max(0, b - a + 1);
        }, 0),
      );
      return {
        families,
        lines: families.flatMap((f, family) =>
          hatches(rect, f.turns, f.spacing, f.offset).map((s) => ({
            ...s,
            family,
          })),
        ),
        bounds: bounds([point(0, 0), point(x.width, x.height)]),
      };
    },
  );
export const moireLineInterferenceExample = {
  input: {
    width: 2,
    height: 2,
    families: [
      { turns: [0], spacings: [1], offsets: [0] },
      { turns: [0.25], spacings: [1], offsets: [0] },
    ],
    seed: 42,
  },
  output: {
    families: [
      { turns: 0, spacing: 1, offset: 0 },
      { turns: 0.25, spacing: 1, offset: 0 },
    ],
    lines: [
      { family: 0, from: [0, 0], to: [2, 0] },
      { family: 0, from: [0, 1], to: [2, 1] },
      { family: 0, from: [0, 2], to: [2, 2] },
      { family: 1, from: [2, 0], to: [2, 2] },
      { family: 1, from: [1, 0], to: [1, 2] },
      { family: 1, from: [0, 0], to: [0, 2] },
    ],
    bounds: { minX: 0, minY: 0, maxX: 2, maxY: 2, width: 2, height: 2 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  MoireLineInterferenceInput,
  MoireLineInterferenceOutput
>;
export const moireLineInterferenceTool = createModelDefinition<
  MoireLineInterferenceInput,
  MoireLineInterferenceOutput
>({
  id: "random/moire-line-interference",
  title: "Random Moire Line Interference Pattern Generator",
  description:
    "Draw two bounded parallel-line families and clip their geometry to a rectangle for app-rendered interference artwork without display-safety claims.",
  inputSchema,
  outputSchema,
  execute: calculateMoireLineInterference,
});
export const runMoireLineInterference = moireLineInterferenceTool.execute;
export default moireLineInterferenceTool;
