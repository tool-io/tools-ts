import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ urlText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "urlText", label: "Url text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const u = H.url(i.urlText);
  H.check(u.protocol === "http:" || u.protocol === "https:");
  const beforeHash = i.urlText.split("#")[0],
    question = beforeHash.indexOf("?");
  return H.finish({
    queryPresent: question >= 0,
    emptyQuery: question >= 0 && question === beforeHash.length - 1,
  });
};
export const example = {
  input: { urlText: "https://example.test/?#x" },
  output: { result: { queryPresent: true, emptyQuery: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/url-empty-query-vs-absent-label",
  title: "Web: URL Empty Query Vs Absent Label Tool",
  description:
    "Distinguish an absent query from an explicitly present empty query in a valid absolute HTTP(S) URL, preserving lexical question marks before the fragment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          emptyQuery: { type: "boolean" },
          queryPresent: { type: "boolean" },
        },
        required: ["emptyQuery", "queryPresent"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
