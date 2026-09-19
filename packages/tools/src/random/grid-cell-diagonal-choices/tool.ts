import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ rows: number; columns: number; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "rows", label: "rows", kind: "integer" },
  { id: "columns", label: "columns", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.rows, 1, 11);
  H.int(i.columns, 1, 11);
  return H.finish({
    seed: i.seed,
    diagonals: Array.from({ length: i.rows }, () =>
      Array.from({ length: i.columns }, () =>
        H.randint(0, 1, random) ? "/" : "\\",
      ),
    ),
  });
};
export const example = {
  input: { rows: 2, columns: 2, seed: "batch56" },
  output: {
    result: {
      seed: "batch56",
      diagonals: [
        ["\\", "\\"],
        ["\\", "\\"],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/grid-cell-diagonal-choices",
  title: "Random Grid Cell Diagonal Choices",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose an independent fair diagonal orientation for each explicit grid cell, returning literal slash/backslash text and no mesh triangulation guarantee.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
