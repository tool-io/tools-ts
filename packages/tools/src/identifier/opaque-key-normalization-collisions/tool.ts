import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ keys: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "keys", label: "keys", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  return H.finish({ collisions: H.duplicates(i.keys, H.keyNormalize) });
};
export const example = {
  input: { keys: ["A", "a", "b"] },
  output: { result: { collisions: [{ key: "a", indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Opaque Key Normalization Collisions",
      "identifiers",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["identifier", "identifiers", "software development"],
    keywords: ["identifiers", "software development"],
  },
  id: "identifier/opaque-key-normalization-collisions",
  title: "Opaque Key Normalization Collisions",
  description:
    "Audit collisions under an explicit NFC plus JavaScript lowercase opaque-key normalization policy; not locale-aware Unicode full casefolding.",
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
