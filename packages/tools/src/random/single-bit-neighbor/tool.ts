import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ bits: string; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bits", label: "bits", kind: "string" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.bits(i.bits);
  H.check(i.bits.length > 0);
  const index = H.randint(0, i.bits.length - 1, random);
  return H.finish({
    seed: i.seed,
    index,
    bits: i.bits
      .split("")
      .map((x, j) => (j === index ? (x === "1" ? "0" : "1") : x))
      .join(""),
  });
};
export const example = {
  input: { bits: "1010", seed: "batch56" },
  output: { result: { seed: "batch56", index: 0, bits: "0010" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/single-bit-neighbor",
  title: "Random Single-Bit Neighbor",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose one uniform bit position and toggle it, returning exact Hamming-distance-one neighbor text.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
