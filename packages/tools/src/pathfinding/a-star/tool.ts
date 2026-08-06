import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GridPoint = { readonly x: number; readonly y: number };
export type AStarResult = {
  readonly cost: number;
  readonly explored: number;
  readonly path: readonly GridPoint[];
};
const key = ({ x, y }: GridPoint) => `${x},${y}`;
export const findAStarPath = (
  grid: readonly (readonly number[])[],
  start: GridPoint,
  goal: GridPoint,
  diagonal: boolean,
): AStarResult | null => {
  const height = grid.length,
    width = grid[0]?.length ?? 0;
  if (
    !height ||
    !width ||
    grid.some(
      (row) =>
        row.length !== width || row.some((cell) => cell !== 0 && cell !== 1),
    )
  )
    return null;
  const inside = ({ x, y }: GridPoint) =>
    x >= 0 && y >= 0 && x < width && y < height && grid[y]?.[x] === 0;
  if (!inside(start) || !inside(goal)) return null;
  const directions = diagonal
    ? [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
        [1, 1],
        [1, -1],
        [-1, 1],
        [-1, -1],
      ]
    : [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ];
  const open = [{ point: start, cost: 0, priority: 0 }];
  const costs = new Map([[key(start), 0]]),
    previous = new Map<string, GridPoint>();
  let explored = 0;
  while (open.length) {
    open.sort((a, b) => a.priority - b.priority);
    const current = open.shift()!;
    explored += 1;
    if (key(current.point) === key(goal)) {
      const path = [goal];
      let cursor = goal;
      while (key(cursor) !== key(start)) {
        cursor = previous.get(key(cursor))!;
        path.push(cursor);
      }
      return {
        cost: Number(current.cost.toPrecision(12)),
        explored,
        path: path.reverse(),
      };
    }
    for (const [dx, dy] of directions) {
      const next = { x: current.point.x + dx!, y: current.point.y + dy! };
      if (!inside(next)) continue;
      const cost = current.cost + (dx && dy ? Math.SQRT2 : 1),
        nextKey = key(next);
      if (cost >= (costs.get(nextKey) ?? Infinity)) continue;
      costs.set(nextKey, cost);
      previous.set(nextKey, current.point);
      open.push({
        point: next,
        cost,
        priority: cost + Math.hypot(goal.x - next.x, goal.y - next.y),
      });
    }
  }
  return { cost: Infinity, explored, path: [] };
};
export const aStarExample = {
  input: {
    diagonal: false,
    goal: { x: 2, y: 2 },
    grid: [
      [0, 0, 0],
      [1, 1, 0],
      [0, 0, 0],
    ],
    start: { x: 0, y: 0 },
  },
  output: {
    result: {
      cost: 4,
      explored: 5,
      path: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
      ],
    },
  },
} satisfies ToolExample<
  {
    readonly diagonal: boolean;
    readonly goal: GridPoint;
    readonly grid: readonly (readonly number[])[];
    readonly start: GridPoint;
  },
  { readonly result: AStarResult }
>;
export const aStarTool = createSimpleTool({
  id: "pathfinding/a-star",
  title: "A* Pathfinding Tool",
  description:
    "Find a shortest path through a blocked rectangular grid with A* search.",
  inputs: [
    { format: "grid/binary", id: "grid", kind: "matrix", label: "Grid" },
    { format: "point/2d", id: "start", kind: "object", label: "Start" },
    { format: "point/2d", id: "goal", kind: "object", label: "Goal" },
    {
      default: false,
      id: "diagonal",
      kind: "boolean",
      label: "Allow diagonal movement",
    },
  ],
  outputs: [
    { format: "path/grid", id: "result", kind: "object", label: "Path" },
  ],
  calculate: (input) => {
    const result = findAStarPath(
      input.grid as number[][],
      input.start as GridPoint,
      input.goal as GridPoint,
      input.diagonal as boolean,
    );
    if (!result || !Number.isFinite(result.cost))
      return simpleError(
        "grid",
        "Enter a traversable grid with reachable start and goal points.",
      );
    return { result };
  },
});
export const runAStar = aStarTool.execute;
export default aStarTool;
