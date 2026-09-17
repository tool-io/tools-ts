import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ text: string; delimiter: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", kind: "string", label: "text" },
  { id: "delimiter", kind: "string", label: "delimiter" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.delimiter.length === 1 && i.delimiter !== "=");
  const tokens = H.splitEscaped(i.text, i.delimiter);
  return H.finish({
    pairs: tokens.map((t) => {
      const j = t.indexOf("=");
      H.check(j >= 0);
      return [t.slice(0, j), t.slice(j + 1)];
    }),
  });
};
export const example = {
  input: { text: "a=1,b=2=3", delimiter: "," },
  output: {
    result: {
      pairs: [
        ["a", "1"],
        ["b", "2=3"],
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/name-value-token-list",
  title: "Name Value Token List Parser",
  description:
    "Parse escaped-delimited name=value tokens at the first equals sign; preserves duplicates, empty names and untrimmed values.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
