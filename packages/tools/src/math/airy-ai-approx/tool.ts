import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, airy } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualX: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "actualX", label: "Actual x", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return { value: airy(input.actualX, false) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualX: 0 },
  output: { result: { value: 0.3550280538878172 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/airy-ai-approx",
  title: "Airy Ai Approximation",
  description:
    "Airy Ai 160-coefficient series|x|\u22644, fixed bounded approximation no large argument claim.",
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
