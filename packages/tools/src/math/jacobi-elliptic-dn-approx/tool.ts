import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, ellipticJacobi } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualU: number;
  readonly actualParameterM: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualU", label: "Actual u", kind: "number" },
  { id: "actualParameterM", label: "Actual parameter m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return { dn: ellipticJacobi(input.actualU, input.actualParameterM).dn };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualU: 0, actualParameterM: 0.5 },
  output: { result: { dn: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/jacobi-elliptic-dn-approx",
  title: "Jacobi Elliptic DN Approximation",
  description:
    "Jacobidn inversion of real first quarter elliptic integral, PARAMETERm(notmodulusk),0\u2264m\u2264.9,|u|\u2264K,512-panel quadrature and bisection. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
