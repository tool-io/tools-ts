import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ width: number; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", label: "width", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.width, 1, 128);
  const index = H.randint(0, i.width - 1, random);
  return H.finish({
    seed: i.seed,
    index,
    mask: Array.from({ length: i.width }, (_, j) =>
      j === index ? "1" : "0",
    ).join(""),
  });
};
export const example = {
  input: { width: 4, seed: "batch56" },
  output: { result: { seed: "batch56", index: 0, mask: "1000" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/one-hot-index-mask",
  title: "Random One-Hot Index Mask",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose one uniform left-to-right bit index and return its one-hot text mask; no integer endianness inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
