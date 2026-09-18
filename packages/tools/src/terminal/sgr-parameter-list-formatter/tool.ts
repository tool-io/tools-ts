import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parameters: readonly number[] }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parameters", label: "parameters", kind: "numberList" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  i.parameters.forEach((x) => H.int(x, 0, 255));
  return H.finish({ token: "[" + i.parameters.join(";") + "m" });
};
export const example = {
  input: { parameters: [1, 31] },
  output: { result: { token: "\u001b[1;31m" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/sgr-parameter-list-formatter",
  title: "Terminal SGR Parameter List Formatter",
  description:
    "Format explicit bounded numeric SGR parameters as a seven-bit CSI token; empty parameter list emits the standard empty/reset SGR, no terminal effects.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
