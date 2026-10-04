import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ etag: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "etag", label: "Etag", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^(?:W\/)?"[\x21\x23-\x7e]*"(?![\s\S])/.test(i.etag));
  return H.finish({
    weak: i.etag.startsWith("W/"),
    opaqueTag: i.etag.slice(i.etag.startsWith("W/") ? 3 : 1, -1),
  });
};
export const example = {
  input: { etag: 'W/"abc"' },
  output: { result: { weak: true, opaqueTag: "abc" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/etag-weakness-marker-split",
  title: "Web: Etag Weakness Marker Split Tool",
  description:
    "Split a strict ASCII RFC9110 entity tag into weak marker and opaque payload; backslash is an ordinary opaque character, not a quoted-string escape.",
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
          opaqueTag: { type: "string" },
          weak: { type: "boolean" },
        },
        required: ["opaqueTag", "weak"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
