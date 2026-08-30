import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  integer,
  inverseMod,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly coefficientA: number;
  readonly coefficientB: number;
  readonly modulus: number;
}>;
export type Output = Readonly<{
  readonly finiteKloostermanRealPart: number;
  readonly finiteKloostermanImaginaryPart: number;
  readonly unitResidueCount: number;
}>;
const inputFields = [
  { id: "coefficientA", label: "Coefficient a", kind: "number" },
  { id: "coefficientB", label: "Coefficient b", kind: "number" },
  { id: "modulus", label: "Modulus", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m = bounded(input.modulus, "modulus", 2, 10000),
    a = integer(input.coefficientA, "a"),
    b = integer(input.coefficientB, "b");
  let re = 0,
    im = 0,
    n = 0;
  const gcd = (a: number, b: number): number => {
    while (b) [a, b] = [b, a % b];
    return a;
  };
  for (let x = 1; x < m; x++)
    if (gcd(x, m) === 1) {
      const inv = inverseMod(x, m),
        angle = (2 * Math.PI * ((a * x + b * inv) % m)) / m;
      re += Math.cos(angle);
      im += Math.sin(angle);
      n++;
    }
  return {
    finiteKloostermanRealPart: re,
    finiteKloostermanImaginaryPart: im,
    unitResidueCount: n,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coefficientA: 1,
  coefficientB: 1,
  modulus: 3,
} satisfies Input;
export const exampleOutput = {
  finiteKloostermanRealPart: -1,
  finiteKloostermanImaginaryPart: 0,
  unitResidueCount: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/kloosterman-sum-approx",
  title: "Kloosterman Sum Approximation",
  description:
    "Evaluate finite Kloosterman exponential sum over invertible residues modulo caller m, using exact modular inverses and floating complex phases; nonunits are omitted, not assigned inverses.",
  inputs: inputFields,
  outputs: [
    {
      id: "finiteKloostermanRealPart",
      label: "Finite kloosterman real part",
      kind: "number",
    },
    {
      id: "finiteKloostermanImaginaryPart",
      label: "Finite kloosterman imaginary part",
      kind: "number",
    },
    { id: "unitResidueCount", label: "Unit residue count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      coefficientA: value.coefficientA as number,
      coefficientB: value.coefficientB as number,
      modulus: value.modulus as number,
    }),
});
export const run = tool.execute;
export default tool;
