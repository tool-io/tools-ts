import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, ipaConsonants } from "../batch-shared.js";
export type Input = Readonly<{
  readonly plainIpaConsonantTokens: readonly string[];
}>;
export type Output = Readonly<{
  readonly consonantPlaceLabels: readonly string[];
  readonly consonantMannerLabels: readonly string[];
  readonly voicedConsonantFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "plainIpaConsonantTokens",
    label: "Plain ipa consonant tokens",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.plainIpaConsonantTokens.length)
    simpleError("consonants", "Explicit consonant token ledger required.");
  const v = input.plainIpaConsonantTokens.map(ipaConsonants);
  return {
    consonantPlaceLabels: v.map((r) => r[0]),
    consonantMannerLabels: v.map((r) => r[1]),
    voicedConsonantFlags: v.map((r) => (r[2] === "voiced" ? 1 : 0)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  plainIpaConsonantTokens: ["p", "b", "ʃ"],
} satisfies Input;
export const exampleOutput = {
  consonantPlaceLabels: ["bilabial", "bilabial", "postalveolar"],
  consonantMannerLabels: ["plosive", "plosive", "fricative"],
  voicedConsonantFlags: [0, 1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/ipa-consonant-place-manner-grid-lookup",
  title: "IPA Consonant Place-Manner Grid Lookup",
  description:
    "Resolve bounded supported basic plain IPA consonants to place/manner/voicing, including Latin g alias for IPA ɡ; unsupported affricates/diacritics remain explicit errors, no acoustic classification.",
  inputs: inputFields,
  outputs: [
    {
      id: "consonantPlaceLabels",
      label: "Consonant place labels",
      kind: "stringList",
    },
    {
      id: "consonantMannerLabels",
      label: "Consonant manner labels",
      kind: "stringList",
    },
    {
      id: "voicedConsonantFlags",
      label: "Voiced consonant flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      plainIpaConsonantTokens:
        value.plainIpaConsonantTokens as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
