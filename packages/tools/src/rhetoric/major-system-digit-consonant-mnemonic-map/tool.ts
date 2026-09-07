import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch43-shared.js";

export type Input = Readonly<{ readonly digitText: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "digitText", label: "Digit text", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!/^[0-9]{1,64}$/.test(input.digitText))
    simpleError("digits", "1–64ASCIIdecimaldigits; leading zeros retained.");
  const map = [
    "s/z",
    "t/d",
    "n",
    "m",
    "r",
    "l",
    "j/sh/ch/zh",
    "k/g",
    "f/v",
    "p/b",
  ];
  return {
    consonantOptions: Array.from(input.digitText, (v) => map[Number(v)]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { digitText: "012" },
  output: { result: { consonantOptions: ["s/z", "t/d", "n"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "rhetoric/major-system-digit-consonant-mnemonic-map",
  title: "Major System Digit Consonant Mnemonic Map",
  description:
    "Common English Major-system phonetic digit mapping, not every dialect or a guaranteed unique word; vowels/free consonants are not inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
