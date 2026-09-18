import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../histogram/batch56-shared.js";
export type Input = Readonly<{ bytes: readonly number[]; seed: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "bytes", label: "bytes", kind: "numberList" },
  { id: "seed", label: "seed", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  H.validate(i, fields);
  const random = H.randomSource(i.seed, context);
  H.bytes(i.bytes);
  H.check(i.bytes.length > 0);
  const index = H.randint(0, i.bytes.length - 1, random),
    raw = H.randint(0, 254, random),
    replacement = raw >= i.bytes[index] ? raw + 1 : raw;
  return H.finish({
    seed: i.seed,
    index,
    replacement,
    bytes: i.bytes.map((x, j) => (j === index ? replacement : x)),
  });
};
export const example = {
  input: { bytes: [0, 100], seed: "batch56" },
  output: {
    result: { seed: "batch56", index: 0, replacement: 1, bytes: [1, 100] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "random/byte-replacement-position",
  title: "Random Byte Replacement Position",
  description:
    "Replay seed or one advancing injected source, uniform over the explicitly stated finite support, not cryptographically secure. Choose a uniform supplied byte position and a uniform different replacement byte among 255 alternatives; position and replacement both exposed.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
