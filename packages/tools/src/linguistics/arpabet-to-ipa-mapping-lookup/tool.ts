import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, at, arpabet } from "../batch-shared.js";
export type Input = Readonly<{ readonly cmuArpabetTokens: readonly string[] }>;
export type Output = Readonly<{
  readonly ipaSegments: readonly string[];
  readonly explicitTokenStressCodes: readonly number[];
  readonly concatenatedUnsyllabifiedIpa: string;
}>;
const inputFields = [
  { id: "cmuArpabetTokens", label: "Cmu arpabet tokens", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.cmuArpabetTokens.length)
    simpleError("tokens", "Explicit ARPABET token ledger required.");
  const converted = input.cmuArpabetTokens.map(arpabet),
    segments = converted.map((s) => s.replace(/^[ˈˌ]/, ""));
  return {
    ipaSegments: segments,
    explicitTokenStressCodes: input.cmuArpabetTokens.map((s) =>
      /[012]$/.test(s) ? Number(s.at(-1)) : -1,
    ),
    concatenatedUnsyllabifiedIpa: segments.join(""),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cmuArpabetTokens: ["HH", "AH0", "L", "OW1"],
} satisfies Input;
export const exampleOutput = {
  ipaSegments: ["h", "ə", "l", "oʊ"],
  explicitTokenStressCodes: [-1, 0, -1, 1],
  concatenatedUnsyllabifiedIpa: "həloʊ",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/arpabet-to-ipa-mapping-lookup",
  title: "ARPABET to IPA Mapping Lookup",
  description:
    "Convert supported CMU ARPABET with unstressed AH/ER reductions and separately preserved 0/1/2 stress annotations; −1 means no explicit stress suffix, no inferred syllabification or misplaced syllable stress markers.",
  inputs: inputFields,
  outputs: [
    { id: "ipaSegments", label: "Ipa segments", kind: "stringList" },
    {
      id: "explicitTokenStressCodes",
      label: "Explicit token stress codes",
      kind: "numberList",
    },
    {
      id: "concatenatedUnsyllabifiedIpa",
      label: "Concatenated unsyllabified ipa",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      cmuArpabetTokens: value.cmuArpabetTokens as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
