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
  return H.finish({
    encodedLine: i.line.replace(/[ \t]+(?![\s\S])/, (s) =>
      Array.from(s)
        .map((c) => (c === " " ? "=20" : "=09"))
        .join(""),
    ),
  });
};
export const example = {
  input: { line: "abc \t" },
  output: { result: { encodedLine: "abc=20=09" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "encode/quoted-printable-line-trailing-space",
  title: "Encoding: Quoted Printable Line Trailing Space Tool",
  description:
    "Encode only terminal spaces/tabs of one quoted-printable content line without CR/LF; not a complete quoted-printable encoder.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { encodedLine: { type: "string" } },
        required: ["encodedLine"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
