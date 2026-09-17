import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ start: number; end: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "start", kind: "number", label: "start" },
  { id: "end", kind: "number", label: "end" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.end >= i.start);
  return H.finish({ token: String(i.start) + ".." + String(i.end) });
};
export const example = {
  input: { start: -2, end: 3.5 },
  output: { result: { token: "-2..3.5" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/numeric-range-token-formatter",
  title: "Numeric Range Token Formatter",
  description:
    "Format a validated ordered finite numeric pair as a start..end token; JavaScript canonical number spelling, not exact decimal-text preservation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
