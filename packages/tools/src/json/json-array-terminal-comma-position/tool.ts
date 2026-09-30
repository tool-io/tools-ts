import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "Text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(/^\s*\[/.test(i.text) && /\]\s*(?![\s\S])/.test(i.text));
  const match = /,\s*\]\s*(?![\s\S])/.exec(i.text);
  return H.finish({
    terminalComma: match !== null,
    commaOffset: match?.index ?? -1,
  });
};
export const example = {
  input: { text: "[1, 2, ]" },
  output: { result: { terminalComma: true, commaOffset: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-array-terminal-comma-position",
  title: "JSON: JSON Array Terminal Comma Position Tool",
  description:
    "Inspect the lexical comma-before-final-bracket pattern in one declared JSON-array fragment; not a general JSON parser and does not remove commas or accept invalid JSON.",
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
          commaOffset: { type: "number" },
          terminalComma: { type: "boolean" },
        },
        required: ["commaOffset", "terminalComma"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
