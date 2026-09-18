import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coefficients: readonly number[];
  offset: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
  { id: "offset", label: "offset", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.coefficients.length > 0 && i.coefficients.length <= 32);
  const out = i.coefficients.map(() => 0);
  i.coefficients.forEach((v, j) => {
    for (let k = 0; k <= j; k++)
      out[k] += v * Number(H.choose(j, k)) * i.offset ** (j - k);
  });
  return H.finish({ coefficients: out });
};
export const example = {
  input: { coefficients: [1, 2, 3], offset: 1 },
  output: { result: { coefficients: [6, 8, 3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-input-translation",
  title: "Polynomial Input Translation Transform",
  description:
    "Translate polynomial input to p(x+offset) by bounded binomial expansion of ascending coefficients; does not approximate or fit coefficients.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
