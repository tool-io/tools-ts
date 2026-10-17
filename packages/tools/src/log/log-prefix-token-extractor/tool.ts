import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ message: string; prefixes: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "message", label: "message", kind: "string" },
  { id: "prefixes", label: "prefixes", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(i.prefixes.every((s) => s.length > 0));
  return H.finish({
    matches: i.prefixes.flatMap((p, index) =>
      i.message.startsWith(p)
        ? [{ index, prefix: p, remainder: i.message.slice(p.length) }]
        : [],
    ),
  });
};
export const example = {
  input: { message: "[x] hi", prefixes: ["[x] ", "[y] "] },
  output: {
    result: { matches: [{ index: 0, prefix: "[x] ", remainder: "hi" }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Log Prefix Token Extractor"],
    collections: ["encode-decode"],
    fields: ["log"],
    keywords: [],
  },
  id: "log/log-prefix-token-extractor",
  title: "Log Prefix Token Extractor",
  description:
    "Extract every caller-defined literal log message prefix and remainder with original prefix indexes; no inferred log format or priority interpretation.",
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
          matches: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                index: { type: "number" },
                prefix: { type: "string" },
                remainder: { type: "string" },
              },
              required: ["index", "prefix", "remainder"],
            },
          },
        },
        required: ["matches"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
