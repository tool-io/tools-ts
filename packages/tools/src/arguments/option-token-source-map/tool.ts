import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ arguments: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "arguments", label: "arguments", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({
    arguments: i.arguments.map((token, index) => {
      const at = token.startsWith("--") ? token.indexOf("=") : -1;
      return {
        index,
        token,
        nameSpan: at >= 0 ? [0, at] : [0, token.length],
        valueSpan: at >= 0 ? [at + 1, token.length] : null,
      };
    }),
  });
};
export const example = {
  input: { arguments: ["--x=a", "file"] },
  output: {
    result: {
      arguments: [
        { index: 0, token: "--x=a", nameSpan: [0, 3], valueSpan: [4, 5] },
        { index: 1, token: "file", nameSpan: [0, 4], valueSpan: null },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Option Token Source Map"],
    collections: ["encode-decode"],
    fields: ["arguments"],
    keywords: [],
  },
  id: "arguments/option-token-source-map",
  title: "Option Token Source Map",
  description:
    "Map UTF-16 name/value source spans for already-tokenized argv long assignments; other arguments remain whole tokens, no shell source reconstruction.",
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
          arguments: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                token: { type: "string" },
                nameSpan: { type: "array", items: { type: "number" } },
                valueSpan: {
                  anyOf: [
                    { type: "array", items: { type: "number" } },
                    { type: "null" },
                  ],
                },
              },
              required: ["index", "token", "nameSpan", "valueSpan"],
            },
          },
        },
        required: ["arguments"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
