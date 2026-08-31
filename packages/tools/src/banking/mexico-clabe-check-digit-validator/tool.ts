import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, clabe } from "../batch-shared.js";
export type Input = Readonly<{ readonly clabeText: string }>;
export type Output = Readonly<{
  readonly expectedCheckDigit: string;
  readonly checkDigitMatches: boolean;
}>;
const inputFields = [
  { id: "clabeText", label: "Clabe text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return clabe(input.clabeText);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { clabeText: "111111111111111115" } satisfies Input;
export const exampleOutput = {
  expectedCheckDigit: "5",
  checkDigitMatches: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/mexico-clabe-check-digit-validator",
  title: "Mexico CLABE Check Digit Validator",
  description:
    "Validate Mexico CLABE eighteen-digit checksum with repeating 3/7/1 weights and per-product mod ten; exact digits preserve zeros, checksum agreement is not institution/account assignment or payment authorization.",
  inputs: inputFields,
  outputs: [
    { id: "expectedCheckDigit", label: "Expected check digit", kind: "string" },
    { id: "checkDigitMatches", label: "Check digit matches", kind: "boolean" },
  ],
  calculate: (value) => calculate({ clabeText: value.clabeText as string }),
});
export const run = tool.execute;
export default tool;
