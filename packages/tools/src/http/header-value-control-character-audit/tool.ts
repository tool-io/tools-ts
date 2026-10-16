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
  return H.finish({
    violations: i.value.split("").flatMap((c, index) => {
      const code = c.charCodeAt(0);
      return code !== 9 && (code < 32 || code === 127 || code > 255)
        ? [{ index, code }]
        : [];
    }),
  });
};
export const example = {
  input: { value: "a\r\nb" },
  output: {
    result: {
      violations: [
        { index: 1, code: 13 },
        { index: 2, code: 10 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "HTTP Header Value Control Character Audit",
      "HTTP",
      "web development",
    ],
    collections: ["encode-decode"],
    fields: ["HTTP", "web development"],
    keywords: ["HTTP", "web development"],
  },
  id: "http/header-value-control-character-audit",
  title: "HTTP Header Value Control Character Audit",
  description:
    "Audit a supplied HTTP field value for forbidden controls or non-Latin-1 code units, retaining exact UTF-16 positions; does not repair or parse a message.",
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
          violations: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                code: { type: "number" },
              },
              required: ["index", "code"],
            },
          },
        },
        required: ["violations"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
