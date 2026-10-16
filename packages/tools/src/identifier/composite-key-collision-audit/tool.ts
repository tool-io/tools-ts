import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ tuplesJson: string; delimiter: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "tuplesJson", label: "tuplesJson", kind: "string" },
  { id: "delimiter", label: "delimiter", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.arr(i.tuplesJson).map((v) => {
    H.check(Array.isArray(v));
    return (v as unknown[]).map(H.scalar);
  });
  H.check(i.delimiter.length > 0);
  return H.finish({
    collisions: H.groups(r, (v) =>
      v.map((x) => String(x)).join(i.delimiter),
    ).filter(
      (g) => H.unique(g.indexes.map((j) => JSON.stringify(r[j]))).length > 1,
    ),
  });
};
export const example = {
  input: { tuplesJson: '[["a:b","c"],["a","b:c"]]', delimiter: ":" },
  output: { result: { collisions: [{ key: "a:b:c", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Composite Key Collision Audit",
      "identifiers",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["identifier", "identifiers", "software development"],
    keywords: ["identifiers", "software development"],
  },
  id: "identifier/composite-key-collision-audit",
  title: "Composite Key Collision Audit",
  description:
    "Audit collisions introduced by naive delimiter-joined scalar composite keys, retaining distinct typed tuple witnesses instead of claiming safe serialization.",
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
          collisions: {
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
        required: ["collisions"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
