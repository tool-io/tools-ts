import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, ipaVowels } from "../batch-shared.js";
export type Input = Readonly<{
  readonly plainIpaVowelTokens: readonly string[];
}>;
export type Output = Readonly<{
  readonly vowelHeightLabels: readonly string[];
  readonly vowelBacknessLabels: readonly string[];
  readonly roundedVowelFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "plainIpaVowelTokens",
    label: "Plain ipa vowel tokens",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.plainIpaVowelTokens.length)
    simpleError("vowels", "Explicit vowel token ledger required.");
  const v = input.plainIpaVowelTokens.map(ipaVowels);
  return {
    vowelHeightLabels: v.map((r) => r[0]),
    vowelBacknessLabels: v.map((r) => r[1]),
    roundedVowelFlags: v.map((r) => (r[2] === "rounded" ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plainIpaVowelTokens: ["i", "ɑ", "y"],
} satisfies Input;
export const exampleOutput = {
  vowelHeightLabels: ["close", "open", "close"],
  vowelBacknessLabels: ["front", "back", "front"],
  roundedVowelFlags: [0, 0, 1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/ipa-vowel-height-backness-classifier",
  title: "IPA Vowel Height/Backness Classifier",
  description:
    "Resolve 28 supported plain standard IPA vowel symbols to chart height/backness/rounding descriptors; explicit tokens required, unsupported diacritics/compound vowels are rejected, not silently stripped.",
  inputs: inputFields,
  outputs: [
    {
      id: "vowelHeightLabels",
      label: "Vowel height labels",
      kind: "stringList",
    },
    {
      id: "vowelBacknessLabels",
      label: "Vowel backness labels",
      kind: "stringList",
    },
    {
      id: "roundedVowelFlags",
      label: "Rounded vowel flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      plainIpaVowelTokens: value.plainIpaVowelTokens as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
