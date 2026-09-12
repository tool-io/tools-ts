import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, sigmaDigital } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualCanonicalDecimal: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCanonicalDecimal",
    label: "Actual canonical decimal",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = sigmaDigital(input.actualCanonicalDecimal, 1, "super");
  return {
    exactDigitInvariantSum: a,
    isNamedDigitInvariant: a === input.actualCanonicalDecimal,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualCanonicalDecimal: "1" },
  output: {
    result: { exactDigitInvariantSum: "1", isNamedDigitInvariant: true },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/superfactorion-checker",
  title: "Superfactorion Checker",
  description:
    "Exact decimal digit superfactorialS(d)=\u03a0k! sum checker, empty product at0=1, input\u2264 128 digits. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
