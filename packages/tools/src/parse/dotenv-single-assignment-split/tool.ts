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
  H.check(!/[\r\n]/.test(i.line));
  const m = /^(?:export +)?([A-Za-z_][A-Za-z0-9_]*)=(.*)(?![\s\S])/.exec(
    i.line,
  );
  H.check(m);
  return H.finish({ key: m![1], rawValue: m![2] });
};
export const example = {
  input: { line: "export KEY=a=b" },
  output: { result: { key: "KEY", rawValue: "a=b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/dotenv-single-assignment-split",
  title: "Parsing: Dotenv Single Assignment Split Tool",
  description:
    "Split a restricted dotenv assignment at its first equals sign, retaining raw value and optional export prefix without evaluating quoting, interpolation or comments.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { key: { type: "string" }, rawValue: { type: "string" } },
        required: ["key", "rawValue"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
