import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ width: number; burst: number; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "width", label: "width", kind: "integer" },
  { id: "burst", label: "burst", kind: "integer" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.int(i.width, 1, 128);
  H.int(i.burst, 1, i.width);
  const start = H.randint(0, i.width - i.burst, random);
  return H.finish({
    seed: i.seed,
    start,
    mask: Array.from({ length: i.width }, (_, j) =>
      j >= start && j < start + i.burst ? "1" : "0",
    ).join(""),
  });
};
export const example = {
  input: { width: 5, burst: 2, seed: "batch56" },
  output: { result: { seed: "batch56", start: 0, mask: "11000" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/contiguous-bit-burst-mask",
  title: "Random Contiguous Bit Burst Mask",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose one uniform nonwrapping contiguous positive bit burst start; the mask is left-to-right text, not an encoded integer.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
