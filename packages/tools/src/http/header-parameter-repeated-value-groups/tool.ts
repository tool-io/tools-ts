import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ parameters: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "parameters", label: "parameters", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const r = H.parameters(i.parameters);
  return H.finish({
    groups: H.groups(r, (v) => JSON.stringify([v.name, v.value])).filter(
      (g) => g.indexes.length > 1,
    ),
  });
};
export const example = {
  input: { parameters: 'a=1;A="1";a=2' },
  output: { result: { groups: [{ key: '["a","1"]', indexes: [0, 1] }] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "http/header-parameter-repeated-value-groups",
  title: "HTTP Header Parameter Repeated Value Groups",
  description:
    "Group repeated exact decoded HTTP parameter values by case-insensitive name plus case-sensitive value, reusing the existing parameter parser.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
