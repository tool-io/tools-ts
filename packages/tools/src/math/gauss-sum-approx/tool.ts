import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, integer } from "../batch-shared.js";
export type Input = Readonly<{
  readonly quadraticCoefficient: number;
  readonly linearCoefficient: number;
  readonly modulus: number;
}>;
export type Output = Readonly<{
  readonly quadraticGaussSumRealPart: number;
  readonly quadraticGaussSumImaginaryPart: number;
}>;
const inputFields = [
  {
    id: "quadraticCoefficient",
    label: "Quadratic coefficient",
    kind: "number",
  },
  { id: "linearCoefficient", label: "Linear coefficient", kind: "number" },
  { id: "modulus", label: "Modulus", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m = bounded(input.modulus, "modulus", 1, 10000),
    a = integer(input.quadraticCoefficient, "a"),
    b = integer(input.linearCoefficient, "b");
  let re = 0,
    im = 0;
  for (let x = 0; x < m; x++) {
    const phase = Number(
        (BigInt(a) * BigInt(x) ** 2n + BigInt(b) * BigInt(x)) % BigInt(m),
      ),
      angle = (2 * Math.PI * phase) / m;
    re += Math.cos(angle);
    im += Math.sin(angle);
  }
  return { quadraticGaussSumRealPart: re, quadraticGaussSumImaginaryPart: im };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  quadraticCoefficient: 1,
  linearCoefficient: 0,
  modulus: 4,
} satisfies Input;
export const exampleOutput = {
  quadraticGaussSumRealPart: 2,
  quadraticGaussSumImaginaryPart: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/gauss-sum-approx",
  title: "Gauss Sum Approximation",
  description:
    "Evaluate finite quadratic Gauss sum Σ exp(2πi(ax²+bx)/m) over all residues, preserving complex output and exact BigInt phase reduction; distinct from Kloosterman inverse-residue phase.",
  inputs: inputFields,
  outputs: [
    {
      id: "quadraticGaussSumRealPart",
      label: "Quadratic gauss sum real part",
      kind: "number",
    },
    {
      id: "quadraticGaussSumImaginaryPart",
      label: "Quadratic gauss sum imaginary part",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      quadraticCoefficient: value.quadraticCoefficient as number,
      linearCoefficient: value.linearCoefficient as number,
      modulus: value.modulus as number,
    }),
});
export const run = tool.execute;
export default tool;
