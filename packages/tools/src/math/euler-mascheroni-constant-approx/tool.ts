import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{ readonly harmonicCutoff: number }>;
export type Output = Readonly<{
  readonly correctedEulerMascheroniEstimate: number;
}>;
const inputFields = [
  { id: "harmonicCutoff", label: "Harmonic cutoff", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const n = bounded(input.harmonicCutoff, "cutoff", 1, 1000000);
  let h = 0;
  for (let k = 1; k <= n; k++) h += 1 / k;
  return {
    correctedEulerMascheroniEstimate:
      h - Math.log(n) - 1 / (2 * n) + 1 / (12 * n * n) - 1 / (120 * n ** 4),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { harmonicCutoff: 10 } satisfies Input;
export const exampleOutput = {
  correctedEulerMascheroniEstimate: 0.5772156609742078,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/euler-mascheroni-constant-approx",
  title: "Euler-Mascheroni Constant Approximation",
  description:
    "Estimate Euler–Mascheroni constant from harmonic partial sum minus log n with explicit Euler–Maclaurin corrections through n^−4; asymptotic estimate, not a static constant lookup or certified error.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedEulerMascheroniEstimate",
      label: "Corrected euler mascheroni estimate",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ harmonicCutoff: value.harmonicCutoff as number }),
});
export const run = tool.execute;
export default tool;
