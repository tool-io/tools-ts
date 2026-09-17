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
  H.check(
    i.token.length >= 2 &&
      i.token[0] === String.fromCharCode(39) &&
      i.token.at(-1) === String.fromCharCode(39) &&
      !/[\r\n\u0000']/.test(i.token.slice(1, -1)),
  );
  return H.finish({ value: i.token.slice(1, -1) });
};
export const example = {
  input: { token: "'a$B'" },
  output: { result: { value: "a$B" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "env/dotenv-single-quoted-value-parser",
  title: "Restricted Dotenv Single Quoted Value Parser",
  description:
    "Parse a restricted complete single-quoted dotenv value literally; no escape or interpolation processing, embedded single quotes and newlines reject.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
