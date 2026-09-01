import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded, sampa } from "../batch-shared.js";
export type Input = Readonly<{
  readonly explicitXsampaTokens: readonly string[];
}>;
export type Output = Readonly<{
  readonly ipaTokenSequence: readonly string[];
  readonly concatenatedIpa: string;
}>;
const inputFields = [
  {
    id: "explicitXsampaTokens",
    label: "Explicit xsampa tokens",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.explicitXsampaTokens.length)
    simpleError(
      "tokens",
      "Explicit bounded whitespace-segmented X-SAMPA tokens required.",
    );
  const mapped = input.explicitXsampaTokens.map(sampa);
  return { ipaTokenSequence: mapped, concatenatedIpa: mapped.join("") };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  explicitXsampaTokens: ["h", "@", "l", "o", ":"],
} satisfies Input;
export const exampleOutput = {
  ipaTokenSequence: ["h", "ə", "l", "o", "ː"],
  concatenatedIpa: "həloː",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/x-sampa-to-ipa-convert",
  title: "X-SAMPA to IPA Converter",
  description:
    "Convert supported plain X-SAMPA base and separate stress/length/nasalization tokens to IPA, including multichar backslash symbols; input tokenization is explicit and unsupported context/affricates are not guessed.",
  inputs: inputFields,
  outputs: [
    { id: "ipaTokenSequence", label: "Ipa token sequence", kind: "stringList" },
    { id: "concatenatedIpa", label: "Concatenated ipa", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      explicitXsampaTokens: value.explicitXsampaTokens as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
