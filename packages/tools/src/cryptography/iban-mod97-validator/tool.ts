import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch36-shared.js";
export type Input = Readonly<{ readonly iban: string }>;
export type Output = Readonly<{
  readonly mod97Remainder: number;
  readonly validMod97: boolean;
}>;
const inputFields = [
  { id: "iban", label: "Iban", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$(?![\s\S])/.test(input.iban))
    simpleError(
      "IBAN",
      "Canonical uppercase15–34-character IBAN without separators required.",
    );
  const rearranged = input.iban.slice(4) + input.iban.slice(0, 4);
  let remainder = 0;
  for (const c of rearranged) {
    const number = c >= "A" ? String(c.charCodeAt(0) - 55) : c;
    for (const digit of number)
      remainder = (remainder * 10 + Number(digit)) % 97;
  }
  return { mod97Remainder: remainder, validMod97: remainder === 1 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { iban: "GB82WEST12345698765432" } satisfies Input;
export const exampleOutput = {
  mod97Remainder: 1,
  validMod97: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cryptography/iban-mod97-validator",
  title: "IBAN mod-97 Validator",
  description:
    "Streaming IBAN mod97 checksum only, distinct from country-specific BBAN length/format catalog; checksum does not establish issued account, country validity or bank existence.",
  inputs: inputFields,
  outputs: [
    { id: "mod97Remainder", label: "Mod97 remainder", kind: "number" },
    { id: "validMod97", label: "Valid mod97", kind: "boolean" },
  ],
  calculate: (value) => calculate({ iban: value.iban as string }),
});
export const run = tool.execute;
export default tool;
