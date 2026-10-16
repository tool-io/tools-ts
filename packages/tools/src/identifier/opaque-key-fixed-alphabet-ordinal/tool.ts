import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ key: string; alphabet: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "key", label: "key", kind: "string" },
  { id: "alphabet", label: "alphabet", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const a = i.alphabet.split("");
  H.check(
    a.length >= 2 && H.unique(a).length === a.length && i.key.length <= 128,
  );
  let value = 0n;
  for (const c of i.key.split("")) {
    const j = a.indexOf(c);
    H.check(j >= 0);
    value = value * BigInt(a.length) + BigInt(j);
  }
  return H.finish({ ordinal: String(value) });
};
export const example = {
  input: { key: "ba", alphabet: "abc" },
  output: { result: { ordinal: "3" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: [
      "Opaque Key Fixed Alphabet Ordinal",
      "identifiers",
      "software development",
    ],
    collections: ["encode-decode"],
    fields: ["identifier", "identifiers", "software development"],
    keywords: ["identifiers", "software development"],
  },
  id: "identifier/opaque-key-fixed-alphabet-ordinal",
  title: "Opaque Key Fixed Alphabet Ordinal",
  description:
    "Encode a fixed-width opaque key as a zero-based positional integer in an explicitly ordered unique UTF-16 alphabet; leading alphabet-zero symbols remain width evidence.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { ordinal: { type: "string" } },
        required: ["ordinal"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
