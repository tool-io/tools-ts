import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ identifiers: readonly string[]; style: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "identifiers", label: "identifiers", kind: "stringList" },
  { id: "style", label: "style", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(
    ["double", "backtick", "bracket"].includes(i.style) &&
      i.identifiers.every((s) => s.length > 0),
  );
  return H.finish({
    identifiers: i.identifiers.map((value) => ({
      value,
      quoted: H.sqlQuote(value, i.style),
    })),
  });
};
export const example = {
  input: { identifiers: ["a", "b c"], style: "double" },
  output: {
    result: {
      identifiers: [
        { value: "a", quoted: '"a"' },
        { value: "b c", quoted: '"b c"' },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sql/identifier-list-quote-plan",
  title: "SQL Identifier List Quote Plan",
  description:
    "Plan literal identifier quoting for each explicit SQL name under double/backtick/bracket doubling rules; no keyword table, catalog identity or execution safety guarantee.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
