import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, modularJ } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualNonnegativeFourierIndex: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualNonnegativeFourierIndex",
    label: "Actual nonnegative fourier index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    exactModularJFourierCoefficient: modularJ(
      input.actualNonnegativeFourierIndex,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualNonnegativeFourierIndex: 1 },
  output: { result: { exactModularJFourierCoefficient: "196884" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/j-invariant-fourier-coefficient",
  title: "J-Invariant Fourier Coefficient Calculator",
  description:
    "Exact positive/constantstandardj(q) Fourier coefficient by formalintegerE4\u00b3/\u0394division, index0\u202612; index0=744not constantofnormalizedJ. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
