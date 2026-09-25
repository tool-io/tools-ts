import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ line: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", label: "Line", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^FNDA:(\d{1,9}),([^\r\n]+)(?![\s\S])/.exec(i.line);
  H.check(m);
  return H.finish({ callCount: Number(m![1]), functionName: m![2] });
};
export const example = {
  input: { line: "FNDA:12,foo,bar" },
  output: { result: { callCount: 12, functionName: "foo,bar" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "development/lcov-function-call-record-parser",
  title: "Development: LCOV Function Call Record Parser Tool",
  description:
    "Parse one bounded LCOV FNDA function-execution record, preserving commas within the function name; no coverage aggregation.",
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
          callCount: { type: "number" },
          functionName: { type: "string" },
        },
        required: ["callCount", "functionName"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
