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
  H.int(i.rows, 1, 128);
  H.int(i.columns, 1, 128);
  const row = H.randint(0, i.rows - 1, random),
    column = H.randint(0, i.columns - 1, random);
  return H.finish({ seed: i.seed, row, column });
};
export const example = {
  input: { rows: 3, columns: 4, seed: "batch56" },
  output: { result: { seed: "batch56", row: 0, column: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/toroidal-grid-origin",
  title: "Random Toroidal Grid Origin",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose a uniform toroidal origin cell from explicit positive grid dimensions; no payload resampling or coordinate wrap transformation is performed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
