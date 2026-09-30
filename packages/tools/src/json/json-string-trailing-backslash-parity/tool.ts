import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ fragment: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fragment", label: "Fragment", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  let count = 0;
  for (let j = i.fragment.length - 1; j >= 0 && i.fragment[j] === "\\"; j--)
    count++;
  return H.finish({
    trailingBackslashes: count,
    nextQuoteEscaped: count % 2 === 1,
  });
};
export const example = {
  input: { fragment: "abc\\\\\\" },
  output: { result: { trailingBackslashes: 3, nextQuoteEscaped: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "json/json-string-trailing-backslash-parity",
  title: "JSON: JSON String Trailing Backslash Parity Tool",
  description:
    "Determine whether a hypothetical next quote is escaped from the exact trailing backslash-run parity of a fragment; not a full JSON string validator.",
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
          nextQuoteEscaped: { type: "boolean" },
          trailingBackslashes: { type: "number" },
        },
        required: ["nextQuoteEscaped", "trailingBackslashes"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
