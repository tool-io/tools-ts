import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ steps: readonly number[]; gridSize: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "steps", kind: "numberList", label: "steps" },
  { id: "gridSize", kind: "integer", label: "gridSize" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.gridSize, 0, 128);
  i.steps.forEach((x) => H.int(x, 0, i.gridSize - 1));
  return H.finish({
    counts: Array.from(
      { length: i.gridSize },
      (_, j) => i.steps.filter((x) => x === j).length,
    ),
  });
};
export const example = {
  input: { steps: [0, 2, 2], gridSize: 4 },
  output: { result: { counts: [1, 0, 2, 0] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/rhythm-step-coverage-counts",
  title: "Rhythm Step Coverage Counts",
  description:
    "Count rhythm events at every bounded grid step including unused steps and collisions.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
