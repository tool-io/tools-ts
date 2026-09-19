import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ bits: string; distance: number; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", label: "bits", kind: "string" },
  { id: "distance", label: "distance", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.bits(i.bits);
  H.check(i.bits.length > 0);
  H.int(i.distance, 0, i.bits.length);
  const positions = H.choosePositions(i.bits.length, i.distance, random).sort(
    (a, b) => a - b,
  );
  return H.finish({
    seed: i.seed,
    positions,
    bits: i.bits
      .split("")
      .map((x, j) => (positions.includes(j) ? (x === "1" ? "0" : "1") : x))
      .join(""),
  });
};
export const example = {
  input: { bits: "1010", distance: 2, seed: "batch56" },
  output: { result: { seed: "batch56", positions: [0, 1], bits: "0110" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/exact-hamming-neighbor",
  title: "Random Exact Hamming Neighbor",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose a uniform exact-cardinality bit subset and toggle it to produce an exact-Hamming-distance neighbor; zero-distance is permitted and consumes no draws.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
