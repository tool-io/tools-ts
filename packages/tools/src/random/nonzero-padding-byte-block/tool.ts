import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ count: number; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "count", label: "count", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.count, 1, 128);
  return H.finish({
    seed: i.seed,
    bytes: Array.from({ length: i.count }, () => H.randint(1, 255, random)),
  });
};
export const example = {
  input: { count: 3, seed: "batch56" },
  output: { result: { seed: "batch56", bytes: [1, 1, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/nonzero-padding-byte-block",
  title: "Random Nonzero Padding Byte Block",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Generate independent uniform nonzero octets in 1..255 for a bounded padding test block; not a security protocol or cryptographic padding guarantee.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
