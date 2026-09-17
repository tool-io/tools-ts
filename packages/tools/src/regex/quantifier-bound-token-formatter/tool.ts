import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{
  minimum: number;
  maximum: number;
  unbounded: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "minimum", kind: "integer", label: "minimum" },
  { id: "maximum", kind: "integer", label: "maximum" },
  { id: "unbounded", kind: "boolean", label: "unbounded" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.minimum, 0, 1e6);
  H.int(i.maximum, 0, 1e6);
  if (!i.unbounded) H.check(i.maximum >= i.minimum);
  return H.finish({
    token: i.unbounded
      ? `{${i.minimum},}`
      : i.minimum === i.maximum
        ? `{${i.minimum}}`
        : `{${i.minimum},${i.maximum}}`,
  });
};
export const example = {
  input: { minimum: 2, maximum: 0, unbounded: true },
  output: { result: { token: "{2,}" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "regex/quantifier-bound-token-formatter",
  title: "Quantifier Bound Token Formatter",
  description:
    "Format bounded repeat quantifier integers with an explicit unbounded flag; ignored maximum is still validated as a nonnegative integer.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
