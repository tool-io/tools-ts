import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, micr } from "../batch-shared.js";
export type Input = Readonly<{ readonly normalizedMicrLine: string }>;
export type Output = Readonly<{
  readonly routingDigits: string;
  readonly accountDigits: string;
  readonly checkSerialDigits: string;
  readonly routingChecksumMatches: boolean;
}>;
const inputFields = [
  { id: "normalizedMicrLine", label: "Normalized micr line", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return micr(input.normalizedMicrLine);
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  normalizedMicrLine: "T021000021T000123U0042U",
} satisfies Input;
export const exampleOutput = {
  routingDigits: "021000021",
  accountDigits: "000123",
  checkSerialDigits: "0042",
  routingChecksumMatches: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/micr-line-routing-account-parser",
  title: "MICR Line Routing Account Parser",
  description:
    "Parse bounded explicitly normalized MICR T-routing-T-account-U-serial-U notation, preserving zeros and checking routing checksum; not arbitrary MICR OCR, actual account validation, image recognition or complete vendor-specific layout support.",
  inputs: inputFields,
  outputs: [
    { id: "routingDigits", label: "Routing digits", kind: "string" },
    { id: "accountDigits", label: "Account digits", kind: "string" },
    { id: "checkSerialDigits", label: "Check serial digits", kind: "string" },
    {
      id: "routingChecksumMatches",
      label: "Routing checksum matches",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({ normalizedMicrLine: value.normalizedMicrLine as string }),
});
export const run = tool.execute;
export default tool;
