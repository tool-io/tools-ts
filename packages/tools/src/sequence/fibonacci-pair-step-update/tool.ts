import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ current: string; next: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "current", label: "Current", kind: "string" },
  { id: "next", label: "Next", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const a = H.big(i.current),
    b = H.big(i.next);
  return H.finish({ current: String(b), next: String(a + b) });
};
export const example = {
  input: { current: "13", next: "21" },
  output: { result: { current: "21", next: "34" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sequence/fibonacci-pair-step-update",
  title: "Sequence: Fibonacci Pair Step Update Tool",
  description:
    "Advance one exact caller-established Fibonacci-style adjacent integer pair by the recurrence (a,b)->(b,a+b); does not certify the supplied pair belongs to canonical Fibonacci numbers.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { current: { type: "string" }, next: { type: "string" } },
        required: ["current", "next"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
