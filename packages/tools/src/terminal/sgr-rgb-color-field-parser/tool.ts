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
    i.parameters.length === 5 &&
      [38, 48].includes(i.parameters[0]) &&
      i.parameters[1] === 2,
  );
  i.parameters.slice(2).forEach((x) => H.int(x, 0, 255));
  return H.finish({
    background: i.parameters[0] === 48,
    rgb: i.parameters.slice(2),
  });
};
export const example = {
  input: { parameters: [48, 2, 1, 2, 3] },
  output: { result: { background: true, rgb: [1, 2, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/sgr-rgb-color-field-parser",
  title: "Terminal SGR RGB Color Field Parser",
  description:
    "Parse exactly one SGR 38/48;2;r;g;b truecolor field with byte channels; no colon syntax, color-space field or terminal gamut guarantee.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
