import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ text: string; escapeSolidus: boolean }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
  { id: "escapeSolidus", label: "Escape solidus", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    jsonString: i.escapeSolidus
      ? JSON.stringify(i.text).replace(/\//g, "\\/")
      : JSON.stringify(i.text),
  });
};
export const example = {
  input: { text: "a/b", escapeSolidus: true },
  output: { result: { jsonString: '"a\\/b"' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-string-solidus-escape-choice",
  title: "JSON: JSON String Solidus Escape Choice Tool",
  description:
    "Serialize one JSON string with explicit optional solidus escaping, delegating all other escaping to JSON.stringify.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { jsonString: { type: "string" } },
        required: ["jsonString"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
