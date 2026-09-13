import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  sourceFor,
  shuffle,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly seed: string;
  readonly actualPlainAsciiText: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "seed", label: "Seed", kind: "string" },
  {
    id: "actualPlainAsciiText",
    label: "Actual plain ascii text",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const random = sourceFor(input.seed, context);
  if (!/^[A-Za-z ]+$/.test(input.actualPlainAsciiText))
    simpleError("text", "ASCIIletters/spaces.");
  const alphabet = shuffle(Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"), random);
  return {
    cipherText: input.actualPlainAsciiText
      .toUpperCase()
      .replace(/[A-Z]/g, (c) => alphabet[c.charCodeAt(0) - 65]),
    cipherAlphabet: alphabet.join(""),
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: { seed: "batch51", actualPlainAsciiText: "ABC XYZ" },
  output: {
    result: {
      cipherText: "EQL NJK",
      cipherAlphabet: "EQLZUIORTPFXWYBMSDAVCHGNJK",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "fun/cryptogram-maker",
  title: "Cryptogram Maker",
  description:
    "Randomuniformmonoalphabeticcryptogramsubstitutionusingoneadvancingsource,spaceskept,identitymappingpossible;not secureencryption. Bounded offline explicitly declared convention;not personalidentity/traitinference,prediction,secure randomness or guaranteedgameresult.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
