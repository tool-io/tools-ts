import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ right: number; down: number; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "right", label: "right", kind: "integer" },
  { id: "down", label: "down", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.right, 0, 127);
  H.int(i.down, 0, 127);
  H.check(i.right + i.down > 0 && i.right + i.down <= 127);
  const positions = new Set(
      H.choosePositions(i.right + i.down, i.down, random),
    ),
    moves = Array.from({ length: i.right + i.down }, (_, j) =>
      positions.has(j) ? "down" : "right",
    ),
    points = [[0, 0]];
  for (const move of moves) {
    const [x, y] = points.at(-1)!;
    points.push([x + Number(move === "right"), y + Number(move === "down")]);
  }
  return H.finish({
    seed: i.seed,
    moves,
    points,
    support: String(H.choose(i.right + i.down, i.down)),
  });
};
export const example = {
  input: { right: 2, down: 1, seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      moves: ["down", "right", "right"],
      points: [
        [0, 0],
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      support: "3",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/monotone-grid-route",
  title: "Random Monotone Grid Route",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Sample uniformly over monotone route move sequences by choosing down-step positions; no obstacle pathfinding, speed or geometric shortest-path guarantee beyond grid moves.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
