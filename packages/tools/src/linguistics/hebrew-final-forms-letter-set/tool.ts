import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly unpointedHebrewWords: readonly string[];
}>;
export type Output = Readonly<{
  readonly normalizedFinalFormWords: readonly string[];
  readonly wordChangedFlags: readonly number[];
}>;
const inputFields = [
  {
    id: "unpointedHebrewWords",
    label: "Unpointed hebrew words",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    !input.unpointedHebrewWords.length ||
    input.unpointedHebrewWords.some((s) => !/^[א-ת]{1,128}$(?![\s\S])/.test(s))
  )
    simpleError(
      "words",
      "Explicit bounded unpointed Hebrew words required; punctuation/niqqud tokenization is not inferred.",
    );
  const finals = "ךםןףץ",
    medial = "כמנפצ",
    out = input.unpointedHebrewWords.map((s) => {
      const regular = [...s].map((c) =>
        finals.includes(c) ? medial[finals.indexOf(c)] : c,
      );
      const last = regular.length - 1,
        index = medial.indexOf(regular[last]);
      if (index >= 0) regular[last] = finals[index];
      return regular.join("");
    });
  return {
    normalizedFinalFormWords: out,
    wordChangedFlags: out.map((s, i) =>
      s !== input.unpointedHebrewWords[i] ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  unpointedHebrewWords: ["מלכ", "כף"],
} satisfies Input;
export const exampleOutput = {
  normalizedFinalFormWords: ["מלך", "כף"],
  wordChangedFlags: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/hebrew-final-forms-letter-set",
  title: "Hebrew Final-Forms Letter Set",
  description:
    "Normalize five Hebrew final forms at explicit unpointed word ends and medialize internal final letters, preserving caller word boundaries; no automatic morphology, niqqud processing or language identification.",
  inputs: inputFields,
  outputs: [
    {
      id: "normalizedFinalFormWords",
      label: "Normalized final form words",
      kind: "stringList",
    },
    { id: "wordChangedFlags", label: "Word changed flags", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      unpointedHebrewWords: value.unpointedHebrewWords as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
