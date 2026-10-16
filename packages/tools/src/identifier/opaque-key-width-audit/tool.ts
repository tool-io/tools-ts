import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ keys: readonly string[]; width: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "keys", label: "keys", kind: "stringList" },
  { id: "width", label: "width", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.int(i.width, 0, 8192);
  return H.finish({
    violations: i.keys.flatMap((key, index) =>
      key.length !== i.width ? [{ index, length: key.length }] : [],
    ),
  });
};
export const example = {
  input: { keys: ["ab", "a", "abc"], width: 2 },
  output: {
    result: {
      violations: [
        { index: 1, length: 1 },
        { index: 2, length: 3 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Opaque Key Width Audit", "identifiers", "software development"],
    collections: ["encode-decode"],
    fields: ["identifier", "identifiers", "software development"],
    keywords: ["identifiers", "software development"],
  },
  id: "identifier/opaque-key-width-audit",
  title: "Opaque Key Width Audit",
  description:
    "Audit exact UTF-16 opaque key width without trimming or number coercion; no identity validity, entropy or byte-width claim.",
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
                length: { type: "number" },
              },
              required: ["index", "length"],
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
