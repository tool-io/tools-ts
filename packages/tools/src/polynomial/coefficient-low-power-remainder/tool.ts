import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{
  coefficients: readonly number[];
  modulusPower: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "coefficients", label: "coefficients", kind: "numberList" },
  { id: "modulusPower", label: "modulusPower", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.coefficients.length > 0);
  H.int(i.modulusPower, 1, 128);
  return H.finish({
    remainder: i.coefficients.slice(0, i.modulusPower),
    quotient:
      i.coefficients.length > i.modulusPower
        ? i.coefficients.slice(i.modulusPower)
        : [0],
  });
};
export const example = {
  input: { coefficients: [1, 2, 3], modulusPower: 2 },
  output: { result: { remainder: [1, 2], quotient: [3] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "polynomial/coefficient-low-power-remainder",
  title: "Polynomial Low Power Remainder",
  description:
    "Split ascending polynomial coefficients into remainder modulo x^k and quotient by x^k; not general polynomial long division.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
