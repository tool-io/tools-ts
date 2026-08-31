import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch-shared.js";
export type Input = Readonly<{
  readonly callerIdentifiedArabicRootTokens: readonly string[];
}>;
export type Output = Readonly<{
  readonly observedRootLetterCounts: readonly number[];
  readonly threeLetterRootCount: number;
  readonly totalObservedRootCount: number;
  readonly threeLetterRootSharePercent: number;
}>;
const inputFields = [
  {
    id: "callerIdentifiedArabicRootTokens",
    label: "Caller identified arabic root tokens",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.callerIdentifiedArabicRootTokens.length)
    simpleError("roots", "Nonempty caller identified root evidence required.");
  const counts = input.callerIdentifiedArabicRootTokens.map((s) => {
      const plain = s.normalize("NFC").replace(/\p{M}/gu, "");
      if (
        !plain.length ||
        [...plain].some(
          (c) => !/\p{L}/u.test(c) || !/\p{Script=Arabic}/u.test(c),
        )
      )
        simpleError(
          "root",
          "Explicit Arabic-letter roots with optional combining vowel marks required, not whole-word morphology guessing.",
        );
      return [...plain].length;
    }),
    n = counts.filter((v) => v === 3).length;
  return {
    observedRootLetterCounts: counts,
    threeLetterRootCount: n,
    totalObservedRootCount: counts.length,
    threeLetterRootSharePercent: (100 * n) / counts.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerIdentifiedArabicRootTokens: ["كتب", "دحرج", "قُرْأ"],
} satisfies Input;
export const exampleOutput = {
  observedRootLetterCounts: [3, 4, 3],
  threeLetterRootCount: 2,
  totalObservedRootCount: 3,
  threeLetterRootSharePercent: 66.66666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/arabic-three-letter-root-share",
  title: "Arabic Three-Letter Root Share",
  description:
    "Audit letter lengths of caller already identified Arabic roots, ignoring combining vowel marks and retaining nontriliteral roots; does not extract roots from words or infer language-wide share.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRootLetterCounts",
      label: "Observed root letter counts",
      kind: "numberList",
    },
    {
      id: "threeLetterRootCount",
      label: "Three letter root count",
      kind: "number",
    },
    {
      id: "totalObservedRootCount",
      label: "Total observed root count",
      kind: "number",
    },
    {
      id: "threeLetterRootSharePercent",
      label: "Three letter root share percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerIdentifiedArabicRootTokens:
        value.callerIdentifiedArabicRootTokens as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
