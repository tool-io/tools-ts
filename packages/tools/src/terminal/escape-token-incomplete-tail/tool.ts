import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const tokens = H.escapeTokens(i.text);
  return H.finish({ tail: tokens.find((v) => !v.complete) ?? null });
};
export const example = {
  input: { text: "x\u001b[31" },
  output: {
    result: {
      tail: {
        start: 1,
        end: 5,
        type: "CSI",
        text: "\u001b[31",
        complete: false,
      },
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Terminal Escape Token Incomplete Tail Finder",
      "terminal escape sequences",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["terminal", "terminal escape sequences", "software development"],
    keywords: ["terminal escape sequences", "software development"],
  },
  id: "terminal/escape-token-incomplete-tail",
  title: "Terminal Escape Token Incomplete Tail Finder",
  description:
    "Find the first incomplete ESC/CSI/OSC lexical token tail under the documented seven-bit scanner; no terminal emulation or UTF-8 byte-stream decoding.",
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
          tail: {
            anyOf: [
              {
                type: "object",
                additionalProperties: false,
                properties: {
                  start: { type: "number" },
                  end: { type: "number" },
                  type: { type: "string" },
                  text: { type: "string" },
                  complete: { type: "boolean" },
                },
                required: ["start", "end", "type", "text", "complete"],
              },
              { type: "null" },
            ],
          },
        },
        required: ["tail"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
