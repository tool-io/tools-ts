import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{
  width: number;
  height: number;
  cuts: number;
  seed: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", label: "width", kind: "integer" },
  { id: "height", label: "height", kind: "integer" },
  { id: "cuts", label: "cuts", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.width, 1, 128);
  H.int(i.height, 1, 128);
  H.int(i.cuts, 1, 127);
  H.check(i.cuts < i.width * i.height);
  const rectangles: number[][] = [[0, 0, i.width, i.height]],
    trace: { rectangle: number; axis: string; cut: number }[] = [];
  for (let j = 0; j < i.cuts; j++) {
    const eligible = rectangles.flatMap((r, k) =>
        r[2] - r[0] > 1 || r[3] - r[1] > 1 ? [k] : [],
      ),
      index = eligible[H.randint(0, eligible.length - 1, random)],
      r = rectangles[index],
      axes = [...(r[2] - r[0] > 1 ? [0] : []), ...(r[3] - r[1] > 1 ? [1] : [])],
      axis = axes[H.randint(0, axes.length - 1, random)],
      cut = H.randint(r[axis] + 1, r[axis + 2] - 1, random),
      a = [...r],
      b = [...r];
    a[axis + 2] = cut;
    b[axis] = cut;
    rectangles.splice(index, 1, a, b);
    trace.push({ rectangle: index, axis: axis === 0 ? "x" : "y", cut });
  }
  return H.finish({ seed: i.seed, trace, rectangles });
};
export const example = {
  input: { width: 4, height: 2, cuts: 1, seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      trace: [{ rectangle: 0, axis: "x", cut: 1 }],
      rectangles: [
        [0, 0, 1, 2],
        [1, 0, 4, 2],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/guillotine-rectangle-cut-trace",
  title: "Random Guillotine Rectangle Cut Trace",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. At each step choose a uniform splittable current rectangle, then a uniform legal axis and integer interior cut; local-choice process, not uniform over final partitions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
