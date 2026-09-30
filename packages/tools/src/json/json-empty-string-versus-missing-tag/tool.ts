import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ objectJson: string; key: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "objectJson", label: "Object json", kind: "string" },
  { id: "key", label: "Key", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const o = H.rec(H.json(i.objectJson));
  return H.finish({
    state: !Object.hasOwn(o, i.key)
      ? "missing"
      : o[i.key] === ""
        ? "empty-string"
        : o[i.key] === null
          ? "null"
          : "other",
  });
};
export const example = {
  input: { objectJson: '{"a":""}', key: "a" },
  output: { result: { state: "empty-string" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-empty-string-versus-missing-tag",
  title: "JSON: JSON Empty String Versus Missing Tag Tool",
  description:
    "Distinguish missing property, explicit empty string and explicit null in one parsed JSON object using own-member presence, not truthiness.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { state: { type: "string" } },
        required: ["state"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
