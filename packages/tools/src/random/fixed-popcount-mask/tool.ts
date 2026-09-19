import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ width: number; ones: number; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", label: "width", kind: "integer" },
  { id: "ones", label: "ones", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.width, 1, 128);
  H.int(i.ones, 1, i.width);
  const positions = H.choosePositions(i.width, i.ones, random).sort(
    (a, b) => a - b,
  );
  return H.finish({
    seed: i.seed,
    positions,
    mask: Array.from({ length: i.width }, (_, j) =>
      positions.includes(j) ? "1" : "0",
    ).join(""),
  });
};
export const example = {
  input: { width: 4, ones: 2, seed: "batch56" },
  output: { result: { seed: "batch56", positions: [0, 1], mask: "1100" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/fixed-popcount-mask",
  title: "Random Fixed Popcount Mask",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose a uniform fixed-cardinality bit-position subset without replacement, returning ascending selected positions; no arbitrary rejection loop.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
