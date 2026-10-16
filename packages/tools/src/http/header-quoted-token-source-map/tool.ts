import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ value: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r: { start: number; end: number; value: string }[] = [];
  for (let j = 0; j < i.value.length; j++)
    if (i.value[j] === '"') {
      const start = j;
      let value = "",
        closed = false;
      while (++j < i.value.length) {
        if (i.value[j] === '"') {
          closed = true;
          break;
        }
        if (i.value[j] === "\\") {
          H.check(++j < i.value.length);
        }
        const c = i.value[j];
        H.check(
          c.charCodeAt(0) === 9 ||
            (c.charCodeAt(0) >= 32 &&
              c.charCodeAt(0) <= 255 &&
              c.charCodeAt(0) !== 127),
        );
        value += c;
      }
      H.check(closed);
      r.push({ start, end: j + 1, value });
    }
  return H.finish({ quotedTokens: r });
};
export const example = {
  input: { value: 'a="b\\"c"' },
  output: { result: { quotedTokens: [{ start: 2, end: 8, value: 'b"c' }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["HTTP Header Quoted Token Source Map", "HTTP", "web development"],
    collections: ["encode-decode"],
    fields: ["HTTP", "web development"],
    keywords: ["HTTP", "web development"],
  },
  id: "http/header-quoted-token-source-map",
  title: "HTTP Header Quoted Token Source Map",
  description:
    "Map complete HTTP quoted-string source spans and decoded quoted-pair values; token contents are Latin-1/HTAB and unclosed escapes/strings reject.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          quotedTokens: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                start: { type: "number" },
                end: { type: "number" },
                value: { type: "string" },
              },
              required: ["start", "end", "value"],
            },
          },
        },
        required: ["quotedTokens"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
