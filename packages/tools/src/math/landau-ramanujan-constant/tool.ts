import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, primes } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualPrimeCutoff: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualPrimeCutoff", label: "Actual prime cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualPrimeCutoff, "cutoff", 2, 1000000);
  let l = -0.5 * Math.LN2;
  for (const p of primes(input.actualPrimeCutoff))
    if (p % 4 === 3) l -= 0.5 * Math.log1p(-1 / (p * p));
  return { truncatedLandauRamanujanConstant: Math.exp(l) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualPrimeCutoff: 7 },
  output: { result: { truncatedLandauRamanujanConstant: 0.7577722283113838 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/landau-ramanujan-constant",
  title: "Landau-Ramanujan Constant Approximation",
  description:
    "FiniteLandau\u2013RamanujanEulerproduct2^\u22121/2\u03a0p\u22613mod4(1\u2212p^\u22122)^\u22121/2, not exact infinite constant. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
