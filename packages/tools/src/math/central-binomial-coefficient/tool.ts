import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, choose } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualN: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualN", label: "Actual n", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualN, "n", 0, 500);
  return {
    exactCentralBinomialCoefficient: choose(
      2 * input.actualN,
      input.actualN,
    ).toString(),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualN: 3 },
  output: { result: { exactCentralBinomialCoefficient: "20" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/central-binomial-coefficient",
  title: "Central Binomial Coefficient Calculator",
  description:
    "Central binomial choose(2n, n) BigInt exact n\u2264500. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
