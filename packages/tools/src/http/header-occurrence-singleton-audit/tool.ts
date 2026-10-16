import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  headersJson: string;
  singletonNames: readonly string[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "headersJson", label: "headersJson", kind: "string" },
  { id: "singletonNames", label: "singletonNames", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.headerPairs(i.headersJson);
  i.singletonNames.forEach((s) => H.check(H.token(s)));
  return H.finish({
    violations: H.groups(r, (v) => v.name.toLowerCase()).filter(
      (g) =>
        i.singletonNames.map((x) => x.toLowerCase()).includes(g.key) &&
        g.indexes.length > 1,
    ),
  });
};
export const example = {
  input: {
    headersJson:
      '[{"name":"X-A","value":"one"},{"name":"x-a","value":"two"},{"name":"Set-Cookie","value":"a=1"}]',
    singletonNames: ["X-A"],
  },
  output: { result: { violations: [{ key: "x-a", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "HTTP Header Singleton Occurrence Audit",
      "HTTP",
      "web development",
    ],
    collections: ["encode-decode"],
    fields: ["HTTP", "web development"],
    keywords: ["HTTP", "web development"],
  },
  id: "http/header-occurrence-singleton-audit",
  title: "HTTP Header Singleton Occurrence Audit",
  description:
    "Audit repeated HTTP fields only for caller-declared singleton names; does not invent a universal singleton table or enforce request-smuggling policy.",
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
                key: { type: "string" },
                indexes: { type: "array", items: { type: "number" } },
              },
              required: ["key", "indexes"],
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
