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
  H.check(
    i.parameters.length === 3 &&
      [38, 48].includes(i.parameters[0]) &&
      i.parameters[1] === 5,
  );
  H.int(i.parameters[2], 0, 255);
  return H.finish({
    background: i.parameters[0] === 48,
    index: i.parameters[2],
  });
};
export const example = {
  input: { parameters: [38, 5, 200] },
  output: { result: { background: false, index: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/sgr-indexed-color-field-parser",
  title: "Terminal SGR Indexed Color Field Parser",
  description:
    "Parse exactly one SGR 38/48;5;n indexed color field, not an arbitrary SGR stream or terminal palette lookup.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
