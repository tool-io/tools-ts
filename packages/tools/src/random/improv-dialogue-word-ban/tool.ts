import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nTags,
  nStringList,
  nInt,
  nPick,
  nSample,
  nGroups,
  nDistinct,
  nIntersect,
  nTick,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type ImprovDialogueWordBanInput = NSeed & {
  readonly briefs: readonly {
    readonly id: string;
    readonly text: string;
    readonly tags: readonly string[];
  }[];
  readonly forbiddenWords: readonly string[];
  readonly banCount: number;
  readonly substitutes: readonly {
    readonly id: string;
    readonly objective: string;
    readonly tags: readonly string[];
  }[];
};
export type ImprovDialogueWordBanOutput = NReplay & {
  readonly bannedWords: readonly string[];
  readonly cards: readonly {
    readonly briefId: string;
    readonly brief: string;
    readonly substituteId: string;
    readonly substituteObjective: string;
    readonly sharedTags: readonly string[];
    readonly checklist: readonly string[];
  }[];
  readonly rounds: readonly (readonly string[])[];
  readonly matchingPolicy: string;
  readonly automaticSpeechMonitoring: boolean;
};
export const inputSchema = nInput({
  briefs: nArray(nObject({ id: nId, text: nText, tags: nTags }), 32, 1),
  forbiddenWords: nStringList,
  banCount: nInt(1, 16),
  substitutes: nArray(
    nObject({ id: nId, objective: nText, tags: nTags }),
    16,
    1,
  ),
});
export const outputSchema = nOutput({
  bannedWords: nStringList,
  cards: nArray(
    nObject({
      briefId: nId,
      brief: nText,
      substituteId: nId,
      substituteObjective: nText,
      sharedTags: nTags,
      checklist: nStringList,
    }),
    32,
    1,
  ),
  rounds: nArray(nArray(nId, 2, 1), 16, 1),
  matchingPolicy: {
    type: "string",
    const: "exact case-sensitive whitespace tokens; punctuation is retained",
  },
  automaticSpeechMonitoring: { type: "boolean", const: false },
});
const isInput = (v: unknown): v is ImprovDialogueWordBanInput =>
  matchesModelInput(v, inputSchema);
export const calculateImprovDialogueWordBan = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ImprovDialogueWordBanOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.briefs.map((b) => b.id),
      "briefs",
    );
    nDistinct(
      x.substitutes.map((s) => s.id),
      "substitutes",
    );
    nDistinct(x.forbiddenWords, "forbiddenWords");
    for (const b of x.briefs) nDistinct(b.tags, "briefs.tags");
    for (const s of x.substitutes) nDistinct(s.tags, "substitutes.tags");
    if (x.forbiddenWords.some((w) => /\s/u.test(w)))
      return simpleError(
        "forbiddenWords",
        "Forbidden words must be single exact nonwhitespace tokens.",
        "invalid_word",
      );
    if (x.banCount > x.forbiddenWords.length)
      return simpleError(
        "banCount",
        "Not enough distinct forbidden tokens.",
        "infeasible_count",
      );
    const bannedWords: string[] = [],
      tick = nTick(),
      eligible = (tags: readonly string[]) =>
        x.substitutes.filter(
          (s) =>
            nIntersect(tags, s.tags).length &&
            !s.objective.split(/\s+/u).some((w) => bannedWords.includes(w)),
        );
    const search = (): boolean => {
      tick();
      if (bannedWords.length === x.banCount)
        return x.briefs.every((b) => eligible(b.tags).length > 0);
      const choices = x.forbiddenWords.filter((w) => !bannedWords.includes(w));
      for (const word of nSample(choices, choices.length, r)) {
        bannedWords.push(word);
        if (search()) return true;
        bannedWords.pop();
      }
      return false;
    };
    if (!search())
      return simpleError(
        "substitutes",
        "No requested ban set permits compatible supplied substitute objectives for every brief.",
        "infeasible_word_bans",
      );
    const cards = x.briefs.map((b) => {
      const s = nPick(eligible(b.tags), r);
      return {
        briefId: b.id,
        brief: b.text,
        substituteId: s.id,
        substituteObjective: s.objective,
        sharedTags: nIntersect(b.tags, s.tags),
        checklist: [...bannedWords],
      };
    });
    return {
      bannedWords,
      cards,
      rounds: nGroups(
        cards.map((c) => c.briefId),
        2,
      ),
      matchingPolicy:
        "exact case-sensitive whitespace tokens; punctuation is retained",
      automaticSpeechMonitoring: false,
    };
  });
export const improvDialogueWordBanExample = {
  input: {
    briefs: [{ id: "letter", text: "Request a letter", tags: ["request"] }],
    forbiddenWords: ["yes", "no"],
    banCount: 1,
    substitutes: [{ id: "open", objective: "Ask openly", tags: ["request"] }],
    seed: 42,
  },
  output: {
    bannedWords: ["no"],
    cards: [
      {
        briefId: "letter",
        brief: "Request a letter",
        substituteId: "open",
        substituteObjective: "Ask openly",
        sharedTags: ["request"],
        checklist: ["no"],
      },
    ],
    rounds: [["letter"]],
    matchingPolicy:
      "exact case-sensitive whitespace tokens; punctuation is retained",
    automaticSpeechMonitoring: false,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ImprovDialogueWordBanInput,
  ImprovDialogueWordBanOutput
>;
export const improvDialogueWordBanTool = createModelDefinition<
  ImprovDialogueWordBanInput,
  ImprovDialogueWordBanOutput
>({
  id: "random/improv-dialogue-word-ban",
  title: "Random Improv Dialogue Word Ban Challenge Generator",
  description:
    "Select supplied forbidden tokens and compatible substitute objectives with a literal checklist and disclosed matching convention; speech monitoring remains outside the tool.",
  inputSchema,
  outputSchema,
  execute: calculateImprovDialogueWordBan,
});
export const runImprovDialogueWordBan = improvDialogueWordBanTool.execute;
export default improvDialogueWordBanTool;
