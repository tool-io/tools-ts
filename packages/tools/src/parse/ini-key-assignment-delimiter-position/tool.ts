import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ line: string; allowedDelimiters: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "line", label: "Line", kind: "string" },
  { id: "allowedDelimiters", label: "Allowed delimiters", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    i.allowedDelimiters.length > 0 &&
      /^[=:]+(?![\s\S])/.test(i.allowedDelimiters) &&
      !/[\r\n]/.test(i.line) &&
      !/^\s*[;#[]/.test(i.line),
  );
  const offset = i.line
    .split("")
    .findIndex((c) => i.allowedDelimiters.includes(c));
  return H.finish({
    delimiterOffset: offset,
    delimiter: offset < 0 ? "" : i.line[offset],
    key: offset < 0 ? i.line.trim() : i.line.slice(0, offset).trim(),
    rawValue: offset < 0 ? "" : i.line.slice(offset + 1),
  });
};
export const example = {
  input: { line: " key : a=b", allowedDelimiters: "=:" },
  output: {
    result: {
      delimiterOffset: 5,
      delimiter: ":",
      key: "key",
      rawValue: " a=b",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/ini-key-assignment-delimiter-position",
  title: "Parsing: Ini Key Assignment Delimiter Position Tool",
  description:
    "Locate the first explicitly allowed equals/colon delimiter in one restricted unquoted INI key line; no sections, escaped delimiters, comments or continuation syntax.",
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
          delimiter: { type: "string" },
          delimiterOffset: { type: "number" },
          key: { type: "string" },
          rawValue: { type: "string" },
        },
        required: ["delimiter", "delimiterOffset", "key", "rawValue"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
