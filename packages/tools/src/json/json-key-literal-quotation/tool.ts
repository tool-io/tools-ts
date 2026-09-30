import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ quotedKey: JSON.stringify(i.key) });
};
export const example = {
  input: { key: 'a"b' },
  output: { result: { quotedKey: '"a\\"b"' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-key-literal-quotation",
  title: "JSON: JSON Key Literal Quotation Tool",
  description:
    "Serialize one arbitrary member-name string as a JSON-quoted key literal using the standard string serializer; does not create an object or infer a pointer.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { quotedKey: { type: "string" } },
        required: ["quotedKey"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
