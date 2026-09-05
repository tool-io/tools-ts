import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{ readonly modernMomme: number }>;
export type Output = Readonly<{ readonly grams: number }>;
const inputFields = [
  { id: "modernMomme", label: "Modern momme", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.modernMomme, "modernMomme");
  return { grams: input.modernMomme * 3.75 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { modernMomme: 2 } satisfies Input;
export const exampleOutput = { grams: 7.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/momme-weight-converter",
  title: "Momme Silk-Pearl Weight Converter",
  description:
    "Explicit modern mass momme=3.75 gram, not regional historical variant. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [{ id: "grams", label: "Grams", kind: "number" }],
  calculate: (value) => calculate({ modernMomme: value.modernMomme as number }),
});
export const run = tool.execute;
export default tool;
