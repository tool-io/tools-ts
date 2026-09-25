import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^([+-])(\d{1,9})(?:,(\d{1,9}))?(?![\s\S])/.exec(i.token);
  H.check(m);
  return H.finish({
    start: Number(m![2]),
    count: m![3] === undefined ? 1 : Number(m![3]),
    side: m![1] === "-" ? "old" : "new",
  });
};
export const example = {
  input: { token: "-12,0" },
  output: { result: { start: 12, count: 0, side: "old" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/unified-diff-range-field-split",
  title: "Development: Unified Diff Range Field Split Tool",
  description:
    "Parse one signed unified-diff range field, preserving omitted count=1 and explicit empty count=0; not a complete patch parser.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          count: { type: "number" },
          side: { type: "string" },
          start: { type: "number" },
        },
        required: ["count", "side", "start"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
