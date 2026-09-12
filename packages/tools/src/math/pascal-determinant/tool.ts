import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pascalDet } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualLeadingSymmetricPascalMatrixSize: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualLeadingSymmetricPascalMatrixSize",
    label: "Actual leading symmetric pascal matrix size",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    determinant: pascalDet(input.actualLeadingSymmetricPascalMatrixSize),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualLeadingSymmetricPascalMatrixSize: 4 },
  output: { result: { determinant: "1" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/pascal-determinant",
  title: "Pascal Determinant Calculator",
  description:
    "Exact leadingN\u00d7N SYMMETRICPascalmatrixAij=binomial(i+j, i), i, j=0\u2026N\u22121 has determinant1viaunittriangularLL^T,1\u2264N\u226464; not arbitraryPascal-like matrix. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
