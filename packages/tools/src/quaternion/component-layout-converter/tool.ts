import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  components: readonly number[];
  scalarLast: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "components", label: "components", kind: "numberList" },
  { id: "scalarLast", label: "scalarLast", kind: "boolean" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.quat(i.components);
  return H.finish({
    components: i.scalarLast
      ? [i.components[3], ...i.components.slice(0, 3)]
      : [...i.components.slice(1), i.components[0]],
  });
};
export const example = {
  input: { components: [1, 2, 3, 4], scalarLast: false },
  output: { result: { components: [2, 3, 4, 1] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "quaternion/component-layout-converter",
  title: "Quaternion Component Layout Converter",
  description:
    "Convert explicit quaternion scalar-first to scalar-last ordering or the reverse under a caller source-layout flag; no normalization or rotation inference.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
