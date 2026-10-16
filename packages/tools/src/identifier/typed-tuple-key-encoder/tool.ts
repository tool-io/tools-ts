import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ valuesJson: string }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "valuesJson", label: "valuesJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const r = H.arr(i.valuesJson).map(H.typedKey);
  return H.finish({
    key: "t:" + r.length + ":" + r.map((v) => v.length + ":" + v).join(""),
  });
};
export const example = {
  input: { valuesJson: '[1,"1",null]' },
  output: { result: { key: "t:3:3:n:15:s:1:12:z:" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  discovery: {
    aliases: ["Typed Tuple Key Encoder", "identifiers", "software development"],
    collections: ["encode-decode"],
    fields: ["identifier", "identifiers", "software development"],
    keywords: ["identifiers", "software development"],
  },
  id: "identifier/typed-tuple-key-encoder",
  title: "Typed Tuple Key Encoder",
  description:
    "Encode a JSON scalar tuple as count plus length-prefixed typed scalar keys, avoiding concatenation ambiguity and preserving component types.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit bounded result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { key: { type: "string" } },
        required: ["key"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
