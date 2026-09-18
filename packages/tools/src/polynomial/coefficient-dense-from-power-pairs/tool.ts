import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ termsJson: string; degree: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "termsJson", label: "termsJson", kind: "string" },
  { id: "degree", label: "degree", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.degree, 0, 127);
  const out = Array(i.degree + 1).fill(0) as number[];
  for (const v of H.records(i.termsJson)) {
    const power = H.int(H.num(v.power), 0, i.degree);
    out[power] += H.num(v.coefficient);
  }
  return H.finish({ coefficients: out });
};
export const example = {
  input: {
    termsJson: '[{"power":0,"coefficient":1},{"power":2,"coefficient":3}]',
    degree: 2,
  },
  output: { result: { coefficients: [1, 0, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-dense-from-power-pairs",
  title: "Polynomial Dense from Power Pairs",
  description:
    "Build bounded dense ascending coefficients by summing explicit sparse power occurrences into a supplied maximum degree; duplicates are summed, missing powers are zeros.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
