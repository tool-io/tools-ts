import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ value: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "value", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(!i.value.includes("\u0000"));
  const portable = /^[A-Za-z0-9_./:-]+(?![\s\S])/.test(i.value);
  return H.finish({
    style: portable ? "unquoted" : "json-double",
    token: portable ? i.value : JSON.stringify(i.value),
  });
};
export const example = {
  input: { value: "a b" },
  output: { result: { style: "json-double", token: '"a b"' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "env/dotenv-literal-value-quote-plan",
  title: "Dotenv Literal Value Quote Plan",
  description:
    "Plan literal dotenv value spelling for this restricted unquoted-or-JSON-double dialect; quoted dollar text stays literal, no shell execution compatibility claim.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
