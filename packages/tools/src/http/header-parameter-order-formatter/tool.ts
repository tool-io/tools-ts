import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parametersJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parametersJson", label: "parametersJson", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    parameters: H.parameterText(H.parameterRecords(i.parametersJson)),
  });
};
export const example = {
  input: {
    parametersJson: '[{"name":"A","value":"x y"},{"name":"a","value":"z"}]',
  },
  output: { result: { parameters: 'a="x y"; a=z' } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-parameter-order-formatter",
  title: "HTTP Header Parameter Order Formatter",
  description:
    "Format ordered HTTP parameter records with token-or-quoted-string values, preserving repeated names and order; no RFC 8187 extended-value inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
