import type { ToolExample } from "../../core/example.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  findAStarPath,
  type GridPoint,
  type AStarResult,
} from "../../pathfinding/a-star/tool.js";
import { matrixAsJson } from "../../matrix/as-json/tool.js";

export type SolvableMazeTestCaseInput = {
  readonly rows: number;
  readonly columns: number;
  readonly start: GridPoint;
  readonly goal: GridPoint;
  readonly wallProbability: number;
  readonly seed?: number;
};
export type SolvableMazeTestCaseOutput = {
  readonly grid: readonly (readonly number[])[];
  readonly start: GridPoint;
  readonly goal: GridPoint;
  readonly plantedPath: readonly GridPoint[];
  readonly solution: AStarResult;
  readonly gridJson: string;
  readonly randomness: GeneratorReplay;
};
const pointSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "integer", minimum: 0, maximum: 31 },
    y: { type: "integer", minimum: 0, maximum: 31 },
  },
  required: ["x", "y"],
} as const;
const pathSchema = {
  type: "array",
  minItems: 1,
  maxItems: 63,
  items: pointSchema,
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rows: { type: "integer", minimum: 1, maximum: 32 },
    columns: { type: "integer", minimum: 1, maximum: 32 },
    start: pointSchema,
    goal: pointSchema,
    wallProbability: { type: "number", minimum: 0, maximum: 1 },
    seed: generatorSeedSchema,
  },
  required: ["rows", "columns", "start", "goal", "wallProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grid: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "array",
        minItems: 1,
        maxItems: 32,
        items: { type: "integer", enum: [0, 1] },
      },
    },
    start: pointSchema,
    goal: pointSchema,
    plantedPath: pathSchema,
    solution: {
      type: "object",
      additionalProperties: false,
      properties: {
        cost: { type: "integer", minimum: 0, maximum: 62 },
        explored: { type: "integer", minimum: 1 },
        path: pathSchema,
      },
      required: ["cost", "explored", "path"],
    },
    gridJson: {
      type: "string",
      minLength: 1,
      maxLength: 4096,
      format: "application/json",
    },
    randomness: generatorReplaySchema,
  },
  required: [
    "grid",
    "start",
    "goal",
    "plantedPath",
    "solution",
    "gridJson",
    "randomness",
  ],
} as const;

const isInput = (input: unknown): input is SolvableMazeTestCaseInput =>
  matchesModelInput(input, inputSchema);
export const calculateSolvableMazeTestCase = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<SolvableMazeTestCaseOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    for (const [field, point] of [
      ["start", input.start],
      ["goal", input.goal],
    ] as const)
      if (point.x >= input.columns || point.y >= input.rows)
        simpleError(
          field,
          "Endpoints must lie inside the requested grid.",
          "endpoint_outside_grid",
        );
    const random = createGeneratorRandom(input.seed, context);
    const grid = Array.from({ length: input.rows }, () =>
      Array.from({ length: input.columns }, () =>
        random.unit() < input.wallProbability ? 1 : 0,
      ),
    );
    const dx = input.goal.x - input.start.x,
      dy = input.goal.y - input.start.y;
    const moves = random.shuffle([
      ...Array.from({ length: Math.abs(dx) }, () => ({
        x: Math.sign(dx),
        y: 0,
      })),
      ...Array.from({ length: Math.abs(dy) }, () => ({
        x: 0,
        y: Math.sign(dy),
      })),
    ]);
    const plantedPath: GridPoint[] = [{ ...input.start }];
    for (const move of moves) {
      const previous = plantedPath[plantedPath.length - 1];
      plantedPath.push({ x: previous.x + move.x, y: previous.y + move.y });
    }
    for (const point of plantedPath) grid[point.y][point.x] = 0;
    const solution = findAStarPath(grid, input.start, input.goal, false),
      gridJson = matrixAsJson(grid, 0);
    if (
      solution === null ||
      !Number.isFinite(solution.cost) ||
      solution.cost !== moves.length ||
      solution.path.length !== moves.length + 1
    )
      throw new Error(
        "The monotone maze witness failed its delegated shortest-path cross-check.",
      );
    if (gridJson === null)
      throw new Error(
        "The generated binary grid was rejected by the matrix JSON core.",
      );
    return toolSuccess({
      grid,
      start: input.start,
      goal: input.goal,
      plantedPath,
      solution,
      gridJson,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const solvableMazeTestCaseExample = {
  input: {
    rows: 3,
    columns: 4,
    start: {
      x: 0,
      y: 0,
    },
    goal: {
      x: 3,
      y: 2,
    },
    wallProbability: 1,
    seed: 42,
  },
  output: {
    grid: [
      [0, 0, 1, 1],
      [1, 0, 0, 0],
      [1, 1, 1, 0],
    ],
    start: {
      x: 0,
      y: 0,
    },
    goal: {
      x: 3,
      y: 2,
    },
    plantedPath: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 1,
        y: 0,
      },
      {
        x: 1,
        y: 1,
      },
      {
        x: 2,
        y: 1,
      },
      {
        x: 3,
        y: 1,
      },
      {
        x: 3,
        y: 2,
      },
    ],
    solution: {
      cost: 5,
      explored: 6,
      path: [
        {
          x: 0,
          y: 0,
        },
        {
          x: 1,
          y: 0,
        },
        {
          x: 1,
          y: 1,
        },
        {
          x: 2,
          y: 1,
        },
        {
          x: 3,
          y: 1,
        },
        {
          x: 3,
          y: 2,
        },
      ],
    },
    gridJson: "[[0,0,1,1],[1,0,0,0],[1,1,1,0]]",
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<SolvableMazeTestCaseInput, SolvableMazeTestCaseOutput>;
export const solvableMazeTestCaseTool = createModelDefinition<
  SolvableMazeTestCaseInput,
  SolvableMazeTestCaseOutput
>({
  id: "random/solvable-maze-test-case",
  title: "Random Solvable Maze Test Case Generator",
  description:
    "Generate a bounded four-neighbor binary grid by independent wall draws followed by carving a shuffled monotone start–goal path, then verify a shortest path with the existing A* solver and serialize the grid; distribution is this construction, not uniform solvable grids, perfect mazes, or unique solutions.",
  inputSchema,
  outputSchema,
  execute: calculateSolvableMazeTestCase,
});
export const runSolvableMazeTestCase = solvableMazeTestCaseTool.execute;
export default solvableMazeTestCaseTool;
