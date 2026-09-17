import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.token.startsWith(String.fromCharCode(34)));
  return H.finish({ value: H.str(H.json(i.token)) });
};
export const example = {
  input: { token: '"a\\nb"' },
  output: { result: { value: "a\nb" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "env/dotenv-double-quoted-value-parser",
  title: "Restricted Dotenv Double Quoted Value Parser",
  description:
    "Parse the explicitly JSON-double-quoted dotenv subset only, with JSON escapes and literal dollar signs; not shell interpolation or every dotenv implementation.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
