import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  let decoded = "";
  for (let j = 0; j < i.token.length; j++) {
    const c = i.token[j];
    if (c !== "\\") {
      H.check(!/[\x00-\x20\x7f]/.test(c));
      decoded += c;
      continue;
    }
    H.check(++j < i.token.length);
    const m = /^[0-9a-fA-F]{1,6}/.exec(i.token.slice(j));
    if (m) {
      let n = parseInt(m[0], 16);
      if (n === 0 || n > 0x10ffff || (n >= 0xd800 && n <= 0xdfff)) n = 0xfffd;
      decoded += String.fromCodePoint(n);
      j += m[0].length - 1;
      if (/[ \t\r\n\f]/.test(i.token[j + 1] ?? "")) {
        j++;
        if (i.token[j] === "\r" && i.token[j + 1] === "\n") j++;
      }
    } else {
      H.check(!/[\r\n\f]/.test(i.token[j]));
      decoded += i.token[j];
    }
  }
  return H.finish({ decoded });
};
export const example = {
  input: { token: "a\\62 c" },
  output: { result: { decoded: "abc" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["CSS Identifier Escape Token Decoder", "CSS", "web development"],
    collections: ["encode-decode"],
    fields: ["CSS", "web development"],
    keywords: ["CSS", "web development"],
  },
  id: "css/css-ident-escape-token-decoder",
  title: "CSS Identifier Escape Token Decoder",
  description:
    "Decode CSS identifier escape sequences to Unicode scalars with replacement for zero/surrogate/out-of-range code points; requires an already isolated identifier token, not full identifier grammar.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { decoded: { type: "string" } },
        required: ["decoded"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
