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
  H.check(
    /^"(?:[\x20-\x21\x23-\x5b\x5d-\x7e]|\\[\x20-\x7e])*"(?![\s\S])/.test(
      i.token,
    ),
  );
  return H.finish({
    unescaped: i.token.slice(1, -1).replace(/\\([\x20-\x7e])/g, "$1"),
  });
};
export const example = {
  input: { token: '"a\\"b"' },
  output: { result: { unescaped: 'a"b' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/mime-quoted-parameter-unescape",
  title: "Parsing: Mime Quoted Parameter Unescape Tool",
  description:
    "Unescape one restricted ASCII MIME quoted-string parameter, honoring quoted-pair escapes and rejecting raw quotes, controls and line folding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { unescaped: { type: "string" } },
        required: ["unescaped"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
