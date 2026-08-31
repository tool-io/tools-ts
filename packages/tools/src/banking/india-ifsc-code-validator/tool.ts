import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch-shared.js";
export type Input = Readonly<{ readonly ifscText: string }>;
export type Output = Readonly<{
  readonly bankIdentifierLetters: string;
  readonly reservedFifthCharacter: string;
  readonly branchIdentifier: string;
}>;
const inputFields = [
  { id: "ifscText", label: "Ifsc text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!/^[A-Z]{4}0[A-Z0-9]{6}$(?![\s\S])/.test(input.ifscText))
    simpleError(
      "ifsc",
      "Exact uppercase four-bank-letter/zero/six-branch-character IFSC syntax required.",
    );
  return {
    bankIdentifierLetters: input.ifscText.slice(0, 4),
    reservedFifthCharacter: "0",
    branchIdentifier: input.ifscText.slice(5),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { ifscText: "ABCD0123456" } satisfies Input;
export const exampleOutput = {
  bankIdentifierLetters: "ABCD",
  reservedFifthCharacter: "0",
  branchIdentifier: "123456",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/india-ifsc-code-validator",
  title: "India IFSC Code Validator",
  description:
    "Parse exact IFSC structure including required fifth-character zero; no central bank directory assignment, account validity or transfer support determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "bankIdentifierLetters",
      label: "Bank identifier letters",
      kind: "string",
    },
    {
      id: "reservedFifthCharacter",
      label: "Reserved fifth character",
      kind: "string",
    },
    { id: "branchIdentifier", label: "Branch identifier", kind: "string" },
  ],
  calculate: (value) => calculate({ ifscText: value.ifscText as string }),
});
export const run = tool.execute;
export default tool;
