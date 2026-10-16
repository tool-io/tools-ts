import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ keys: readonly string[]; alphabet: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "keys", label: "keys", kind: "stringList" },
  { id: "alphabet", label: "alphabet", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  H.check(
    i.alphabet.length > 0 &&
      H.unique(i.alphabet.split("")).length === i.alphabet.length,
  );
  return H.finish({
    violations: i.keys.flatMap((key, index) =>
      key
        .split("")
        .flatMap((character, position) =>
          i.alphabet.includes(character)
            ? []
            : [{ index, position, character }],
        ),
    ),
  });
};
export const example = {
  input: { keys: ["ab", "a?"], alphabet: "abc" },
  output: {
    result: { violations: [{ index: 1, position: 1, character: "?" }] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Opaque Key Alphabet Audit",
      "identifiers",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["identifier", "identifiers", "software development"],
    keywords: ["identifiers", "software development"],
  },
  id: "identifier/opaque-key-alphabet-audit",
  title: "Opaque Key Alphabet Audit",
  description:
    "Audit opaque key UTF-16 code units against an explicit caller alphabet with positions; not Unicode grapheme, entropy or checksum validation.",
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
                position: { type: "number" },
                character: { type: "string" },
              },
              required: ["index", "position", "character"],
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
