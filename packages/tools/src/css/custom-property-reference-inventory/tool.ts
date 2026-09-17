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
  return H.finish({ references: H.cssReferences(i.value) });
};
export const example = {
  input: { value: 'var(--a, var(--b)) "var(--c)"' },
  output: {
    result: {
      references: [
        { name: "--a", position: 0 },
        { name: "--b", position: 9 },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "css/custom-property-reference-inventory",
  title: "CSS Custom Property Reference Inventory",
  description:
    "Inventory unescaped ASCII var() reference names including nested fallbacks, ignoring quoted strings; existing variable-parser extracts declarations instead. Comment-free balanced CSS subset.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
