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
  const pos = i.token.indexOf("=");
  H.check(
    pos > 0 &&
      /^[\x21-\x7e]+(?![\s\S])/.test(i.token.slice(0, pos)) &&
      !/[=\]" ]/.test(i.token.slice(0, pos)) &&
      i.token.slice(0, pos).length <= 32,
  );
  const raw = i.token.slice(pos + 1);
  H.check(raw.startsWith('"') && raw.endsWith('"'));
  let decoded = "";
  for (let j = 1; j < raw.length - 1; j++) {
    const c = raw[j];
    if (c === "\\") {
      j++;
      H.check(j < raw.length - 1 && ["\\", '"', "]"].includes(raw[j]));
      decoded += raw[j];
    } else {
      H.check(c !== '"' && c !== "]" && c !== "\r" && c !== "\n");
      decoded += c;
    }
  }
  return H.finish({ name: i.token.slice(0, pos), value: decoded });
};
export const example = {
  input: { token: 'key="a\\]b"' },
  output: { result: { name: "key", value: "a]b" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/syslog-sdid-parameter-token",
  title: "Parsing: Syslog Sdid Parameter Token Tool",
  description:
    'Parse one restricted RFC5424 structured-data name="value" parameter and its escaped quote/backslash/right-bracket rules; no whole syslog message or unescaping unknown sequences.',
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { name: { type: "string" }, value: { type: "string" } },
        required: ["name", "value"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
