import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nText,
  nStringList,
  nInt,
  nWidth,
  nWrapped,
  nWrap,
  nPick,
  nSample,
  nDistinct,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type MicrofictionWordBudgetInput = NSeed & {
  readonly premises: readonly string[];
  readonly words: readonly string[];
  readonly requiredCount: number;
  readonly minimumWords: number;
  readonly maximumWords: number;
  readonly wrapWidth: number;
};
export type MicrofictionWordBudgetOutput = NReplay & {
  readonly premise: NWrapped;
  readonly requiredWords: readonly string[];
  readonly wordBudget: {
    readonly minimum: number;
    readonly maximum: number;
    readonly counting: string;
  };
  readonly checklist: readonly {
    readonly word: string;
    readonly minimumOccurrences: number;
  }[];
};
export const inputSchema = nInput({
  premises: nStringList,
  words: nArray(nText, 32, 1),
  requiredCount: nInt(1, 32),
  minimumWords: nInt(1),
  maximumWords: nInt(1),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  premise: nWrapped,
  requiredWords: nArray(nText, 32, 1),
  wordBudget: nObject({
    minimum: nInt(1),
    maximum: nInt(1),
    counting: {
      type: "string",
      const:
        "nonempty whitespace-separated tokens; exact case-sensitive required tokens",
    },
  }),
  checklist: nArray(
    nObject({ word: nText, minimumOccurrences: { type: "integer", const: 1 } }),
    32,
    1,
  ),
});
const isInput = (v: unknown): v is MicrofictionWordBudgetInput =>
  matchesModelInput(v, inputSchema);
export const calculateMicrofictionWordBudget = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<MicrofictionWordBudgetOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.words, "words");
    if (x.words.some((w) => /\s/u.test(w)))
      return simpleError(
        "words",
        "Required words must each be one exact nonwhitespace token.",
        "invalid_word",
      );
    if (x.maximumWords < x.minimumWords)
      return simpleError(
        "maximumWords",
        "Word limits must be ordered.",
        "invalid_word_budget",
      );
    if (x.requiredCount > x.maximumWords)
      return simpleError(
        "requiredCount",
        "Required tokens cannot fit the maximum word budget.",
        "infeasible_word_budget",
      );
    const premise = nWrap(nPick(x.premises, r), x.wrapWidth),
      requiredWords = nSample(x.words, x.requiredCount, r);
    return {
      premise,
      requiredWords,
      wordBudget: {
        minimum: x.minimumWords,
        maximum: x.maximumWords,
        counting:
          "nonempty whitespace-separated tokens; exact case-sensitive required tokens",
      },
      checklist: requiredWords.map((word) => ({ word, minimumOccurrences: 1 })),
    };
  });
export const microfictionWordBudgetExample = {
  input: {
    premises: ["A bell at the harbor."],
    words: ["map", "bell"],
    requiredCount: 2,
    minimumWords: 5,
    maximumWords: 12,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    premise: { text: "A bell at the harbor.", lineCount: 1 },
    requiredWords: ["map", "bell"],
    wordBudget: {
      minimum: 5,
      maximum: 12,
      counting:
        "nonempty whitespace-separated tokens; exact case-sensitive required tokens",
    },
    checklist: [
      { word: "map", minimumOccurrences: 1 },
      { word: "bell", minimumOccurrences: 1 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  MicrofictionWordBudgetInput,
  MicrofictionWordBudgetOutput
>;
export const microfictionWordBudgetTool = createModelDefinition<
  MicrofictionWordBudgetInput,
  MicrofictionWordBudgetOutput
>({
  id: "random/microfiction-word-budget",
  title: "Random Microfiction Word Budget Challenge Generator",
  description:
    "Draw supplied premises and distinct required tokens into explicit word-budget briefs and checklist keys using a disclosed whitespace convention; no prose is generated.",
  inputSchema,
  outputSchema,
  execute: calculateMicrofictionWordBudget,
});
export const runMicrofictionWordBudget = microfictionWordBudgetTool.execute;
export default microfictionWordBudgetTool;
