import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly sourceQuote: string;
  readonly backTranslatedQuote: string;
  readonly minimumSimilarityPercent: number;
}>;
export type Output = Readonly<{
  readonly jaccardSimilarityPercent: number;
  readonly sourceOnlyTokens: readonly string[];
  readonly backTranslationOnlyTokens: readonly string[];
  readonly meetsThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  const tokens = (value: string) =>
    new Set(value.toLocaleLowerCase("en-US").match(/[\p{L}\p{N}]+/gu) ?? []);
  const source = tokens(input.sourceQuote),
    back = tokens(input.backTranslatedQuote);
  if (source.size === 0 || back.size === 0)
    simpleError(
      "sourceQuote",
      "Both quotes must contain words.",
      "empty_quote",
    );
  const intersection = [...source].filter((value) => back.has(value));
  const union = new Set([...source, ...back]);
  const jaccardSimilarityPercent = (intersection.length / union.size) * 100;
  return {
    jaccardSimilarityPercent,
    sourceOnlyTokens: [...source].filter((value) => !back.has(value)).sort(),
    backTranslationOnlyTokens: [...back]
      .filter((value) => !source.has(value))
      .sort(),
    meetsThreshold: jaccardSimilarityPercent >= input.minimumSimilarityPercent,
  };
};

export const exampleInput = {
  sourceQuote: "The council approved the budget today",
  backTranslatedQuote: "Today the council approved a budget",
  minimumSimilarityPercent: 60,
} satisfies Input;
export const exampleOutput = {
  jaccardSimilarityPercent: 83.33333333333334,
  sourceOnlyTokens: [],
  backTranslationOnlyTokens: ["a"],
  meetsThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      sourceQuote: input.sourceQuote as string,
      backTranslatedQuote: input.backTranslatedQuote as string,
      minimumSimilarityPercent: input.minimumSimilarityPercent as number,
    }),
  description:
    "Compare token sets in a source rendering and back-translation without claiming semantic equivalence.",
  id: "journalism/back-translation-similarity",
  inputs: [
    { id: "sourceQuote", label: "Source-language rendering", kind: "string" },
    {
      id: "backTranslatedQuote",
      label: "Back-translated rendering",
      kind: "string",
    },
    {
      id: "minimumSimilarityPercent",
      label: "Minimum token similarity",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "jaccardSimilarityPercent",
      label: "Token-set similarity",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    { id: "sourceOnlyTokens", label: "Source-only tokens", kind: "stringList" },
    {
      id: "backTranslationOnlyTokens",
      label: "Back-translation-only tokens",
      kind: "stringList",
    },
    { id: "meetsThreshold", label: "Meets threshold", kind: "boolean" },
  ],
  title: "Back-Translation Similarity",
});

export const run = tool.execute;
export default tool;
