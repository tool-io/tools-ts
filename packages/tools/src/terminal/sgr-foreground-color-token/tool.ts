import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ index: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "index", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.index, 0, 255);
  return H.finish({
    parameters: [38, 5, i.index],
    token: "[38;5;" + i.index + "m",
  });
};
export const example = {
  input: { index: 200 },
  output: { result: { parameters: [38, 5, 200], token: "\u001b[38;5;200m" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/sgr-foreground-color-token",
  title: "Terminal SGR Foreground Color Token",
  description:
    "Format an explicit 0\u2013255 indexed SGR foreground color field; no RGB palette mapping or terminal display guarantee.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
