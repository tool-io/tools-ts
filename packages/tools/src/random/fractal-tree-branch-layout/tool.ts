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
export type FractalTreeBranchLayoutInput = AcSeed & {
  readonly depth: number;
  readonly rootLength: number;
  readonly headingTurns: number;
  readonly lengthRatio: number;
  readonly minimumAngleTurns: number;
  readonly maximumAngleTurns: number;
};
export type FractalTreeBranchLayoutOutput = AcReplay & {
  readonly branches: readonly {
    readonly id: number;
    readonly parent: number;
    readonly depth: number;
    readonly from: Point;
    readonly to: Point;
    readonly length: number;
    readonly headingTurns: number;
  }[];
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  depth: integer(0, 5),
  rootLength: positive,
  headingTurns: num,
  lengthRatio: { ...positive, maximum: 1 },
  minimumAngleTurns: { type: "number", minimum: 0, maximum: 0.5 },
  maximumAngleTurns: { type: "number", minimum: 0, maximum: 0.5 },
});
export const outputSchema = outputObject({
  branches: array(
    object({
      id: integer(0, 62),
      parent: integer(-1, 62),
      depth: integer(0, 5),
      from: pointSchema,
      to: pointSchema,
      length: positive,
      headingTurns: num,
    }),
    63,
    1,
  ),
  bounds: boxSchema,
});
const isInput = (v: unknown): v is FractalTreeBranchLayoutInput =>
  matchesModelInput(v, inputSchema);
export const calculateFractalTreeBranchLayout = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<FractalTreeBranchLayoutOutput, "randomness"> => {
      ordered(x.minimumAngleTurns, x.maximumAngleTurns, "maximumAngleTurns");
      const branches: FractalTreeBranchLayoutOutput["branches"][number][] = [];
      const grow = (
        from: Point,
        length: number,
        headingTurns: number,
        depth: number,
        parent: number,
      ): void => {
        if (length <= 0)
          return simpleError(
            "lengthRatio",
            "A branch length is below numeric resolution.",
            "numeric_resolution",
          );
        const [c, s] = trig(headingTurns),
          to = point(from[0] + length * c, from[1] + length * s),
          id = branches.length;
        if (to[0] === from[0] && to[1] === from[1])
          return simpleError(
            "rootLength",
            "A branch endpoint is below coordinate resolution.",
            "numeric_resolution",
          );
        branches.push({ id, parent, depth, from, to, length, headingTurns });
        if (depth < x.depth)
          for (const sign of [-1, 1]) {
            const angle =
              x.minimumAngleTurns +
              random.unit() * (x.maximumAngleTurns - x.minimumAngleTurns);
            grow(
              to,
              finite(length * x.lengthRatio),
              finite(headingTurns + sign * angle),
              depth + 1,
              id,
            );
          }
      };
      grow(point(0, 0), x.rootLength, finite(x.headingTurns), 0, -1);
      return {
        branches,
        bounds: bounds(branches.flatMap((b) => [b.from, b.to])),
      };
    },
  );
export const fractalTreeBranchLayoutExample = {
  input: {
    depth: 1,
    rootLength: 4,
    headingTurns: 0,
    lengthRatio: 0.5,
    minimumAngleTurns: 0.25,
    maximumAngleTurns: 0.25,
    seed: 42,
  },
  output: {
    branches: [
      {
        id: 0,
        parent: -1,
        depth: 0,
        from: [0, 0],
        to: [4, 0],
        length: 4,
        headingTurns: 0,
      },
      {
        id: 1,
        parent: 0,
        depth: 1,
        from: [4, 0],
        to: [4, -2],
        length: 2,
        headingTurns: -0.25,
      },
      {
        id: 2,
        parent: 0,
        depth: 1,
        from: [4, 0],
        to: [4, 2],
        length: 2,
        headingTurns: 0.25,
      },
    ],
    bounds: { minX: 0, minY: -2, maxX: 4, maxY: 2, width: 4, height: 4 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  FractalTreeBranchLayoutInput,
  FractalTreeBranchLayoutOutput
>;
export const fractalTreeBranchLayoutTool = createModelDefinition<
  FractalTreeBranchLayoutInput,
  FractalTreeBranchLayoutOutput
>({
  id: "random/fractal-tree-branch-layout",
  title: "Random Fractal Tree Branch Layout Generator",
  description:
    "Construct a depth-bounded binary branch tree from explicit length and angle rules with parent traces; no botanical realism is inferred.",
  inputSchema,
  outputSchema,
  execute: calculateFractalTreeBranchLayout,
});
export const runFractalTreeBranchLayout = fractalTreeBranchLayoutTool.execute;
export default fractalTreeBranchLayoutTool;
