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
  point,
  trig,
  bounds,
  pointSchema,
  boxSchema,
  type Point,
  type Box,
} from "../m500b-art-craft-geometry.js";
export type RecursiveCircleNestingInput = AcSeed & {
  readonly radius: number;
  readonly depth: number;
  readonly childRatio: number;
  readonly axisTurns: readonly number[];
};
export type RecursiveCircleNestingOutput = AcReplay & {
  readonly circles: readonly {
    readonly id: number;
    readonly parent: number;
    readonly center: Point;
    readonly radius: number;
  }[];
  readonly bounds: Box;
};
export const inputSchema = inputObject({
  radius: positive,
  depth: integer(0, 5),
  childRatio: { ...positive, maximum: 0.5 },
  axisTurns: array(num, 16, 1),
});
export const outputSchema = outputObject({
  circles: array(
    object({
      id: integer(0, 62),
      parent: integer(-1, 62),
      center: pointSchema,
      radius: positive,
    }),
    63,
    1,
  ),
  bounds: boxSchema,
});
const isInput = (v: unknown): v is RecursiveCircleNestingInput =>
  matchesModelInput(v, inputSchema);
export const calculateRecursiveCircleNesting = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<RecursiveCircleNestingOutput, "randomness"> => {
      const circles: RecursiveCircleNestingOutput["circles"][number][] = [];
      const nest = (
        center: Point,
        radius: number,
        parent: number,
        depth: number,
      ): void => {
        const id = circles.length;
        circles.push({ id, parent, center, radius });
        if (depth === x.depth) return;
        const axis = pick(x.axisTurns, random),
          [c, s] = trig(axis),
          r = finite(radius * x.childRatio),
          distance = radius - r;
        if (r <= 0 || distance <= 0)
          return simpleError(
            "childRatio",
            "Child dimensions are below numeric resolution.",
            "numeric_resolution",
          );
        for (const sign of [-1, 1])
          nest(
            point(
              center[0] + sign * distance * c,
              center[1] + sign * distance * s,
            ),
            r,
            id,
            depth + 1,
          );
      };
      nest(point(0, 0), x.radius, -1, 0);
      return {
        circles,
        bounds: bounds([
          point(-x.radius, -x.radius),
          point(x.radius, x.radius),
        ]),
      };
    },
  );
export const recursiveCircleNestingExample = {
  input: { radius: 4, depth: 1, childRatio: 0.25, axisTurns: [0], seed: 42 },
  output: {
    circles: [
      { id: 0, parent: -1, center: [0, 0], radius: 4 },
      { id: 1, parent: 0, center: [-3, 0], radius: 1 },
      { id: 2, parent: 0, center: [3, 0], radius: 1 },
    ],
    bounds: { minX: -4, minY: -4, maxX: 4, maxY: 4, width: 8, height: 8 },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  RecursiveCircleNestingInput,
  RecursiveCircleNestingOutput
>;
export const recursiveCircleNestingTool = createModelDefinition<
  RecursiveCircleNestingInput,
  RecursiveCircleNestingOutput
>({
  id: "random/recursive-circle-nesting",
  title: "Random Recursive Circle Nesting Pattern Generator",
  description:
    "Construct contained binary circle hierarchies with opposite tangent children and disjoint sibling interiors; drawing and clipping remain external.",
  inputSchema,
  outputSchema,
  execute: calculateRecursiveCircleNesting,
});
export const runRecursiveCircleNesting = recursiveCircleNestingTool.execute;
export default recursiveCircleNestingTool;
