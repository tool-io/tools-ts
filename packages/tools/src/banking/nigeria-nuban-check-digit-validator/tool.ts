import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nuban } from "../batch-shared.js";
export type Input = Readonly<{
  readonly legacyThreeDigitBankCode: string;
  readonly tenDigitAccountText: string;
}>;
export type Output = Readonly<{
  readonly expectedCheckDigit: string;
  readonly checkDigitMatches: boolean;
}>;
const inputFields = [
  {
    id: "legacyThreeDigitBankCode",
    label: "Legacy three digit bank code",
    kind: "string",
  },
  {
    id: "tenDigitAccountText",
    label: "Ten digit account text",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return nuban(input.legacyThreeDigitBankCode, input.tenDigitAccountText);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  legacyThreeDigitBankCode: "044",
  tenDigitAccountText: "0000000000",
} satisfies Input;
export const exampleOutput = {
  expectedCheckDigit: "0",
  checkDigitMatches: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/nigeria-nuban-check-digit-validator",
  title: "Nigeria NUBAN Check Digit Validator",
  description:
    "Validate legacy three-digit-bank-code NUBAN weighted check digit against ten-digit ASCII account; expanded institution-code versions require another explicit model, and checksum does not verify a live account.",
  inputs: inputFields,
  outputs: [
    { id: "expectedCheckDigit", label: "Expected check digit", kind: "string" },
    { id: "checkDigitMatches", label: "Check digit matches", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      legacyThreeDigitBankCode: value.legacyThreeDigitBankCode as string,
      tenDigitAccountText: value.tenDigitAccountText as string,
    }),
});
export const run = tool.execute;
export default tool;
