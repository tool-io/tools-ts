import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  width: number;
  height: number;
  count: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", label: "width", kind: "integer" },
  { id: "height", label: "height", kind: "integer" },
  { id: "count", label: "count", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.width, 1, 256);
  H.int(i.height, 1, 256);
  const size = Math.floor((Math.min(i.width, i.height) - 1) / 2) + 1;
  H.int(i.count, 1, size);
  const insets = H.choosePositions(size, i.count, random).sort((a, b) => a - b);
  return H.finish({
    seed: i.seed,
    insets,
    rectangles: insets.map((d) => [d, d, i.width - d, i.height - d]),
  });
};
export const example = {
  input: { width: 10, height: 8, count: 2, seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      insets: [0, 1],
      rectangles: [
        [0, 0, 10, 8],
        [1, 1, 9, 7],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/concentric-rectangle-insets",
  title: "Random Concentric Rectangle Insets",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose a uniform distinct subset of feasible integer concentric inset distances then sort outward-to-inward; rectangles have positive interior dimensions, not arbitrary recursive cuts.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
