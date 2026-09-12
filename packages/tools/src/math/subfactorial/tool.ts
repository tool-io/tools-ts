import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, subfactorial } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualN: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualN", label: "Actual n", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return { exactSubfactorial: subfactorial(input.actualN) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualN: 4 },
  output: { result: { exactSubfactorial: "9" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/subfactorial",
  title: "Subfactorial Calculator",
  description:
    "Exactderangement!nBigIntrecurrence,(n\u22121)(!(n\u22121)+!(n\u22122)),0\u2264n\u22641000. Explicit bounded resource/branch and actual observations or independently verified parameters; no unproved infinite assertion certified.",
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
