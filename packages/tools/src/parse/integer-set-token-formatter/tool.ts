import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ values: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", kind: "numberList", label: "values" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.values.forEach((x) => H.int(x, -1e9, 1e9));
  return H.finish({
    token:
      "{" +
      H.unique(i.values)
        .sort((a, b) => a - b)
        .join(",") +
      "}",
  });
};
export const example = {
  input: { values: [3, -1, 3] },
  output: { result: { token: "{-1,3}" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parse/integer-set-token-formatter",
  title: "Integer Set Token Formatter",
  description:
    "Format finite bounded integer values as a canonical sorted brace-delimited set token, omitting duplicate values.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
