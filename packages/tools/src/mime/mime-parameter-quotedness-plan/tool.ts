import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ values: readonly string[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "values", label: "values", kind: "stringList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.values.forEach(H.quoted);
  return H.finish({
    values: i.values.map((value) => ({
      value,
      quoted: !H.token(value),
      serialized: H.token(value) ? value : H.quoted(value),
    })),
  });
};
export const example = {
  input: { values: ["a", "x y", ""] },
  output: {
    result: {
      values: [
        { value: "a", quoted: false, serialized: "a" },
        { value: "x y", quoted: true, serialized: '"x y"' },
        { value: "", quoted: true, serialized: '""' },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mime/mime-parameter-quotedness-plan",
  title: "MIME Parameter Quotedness Plan",
  description:
    "Plan MIME parameter value token versus quoted-string spelling, including empty strings and escaped quotes; not a charset/extended-parameter encoder.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
