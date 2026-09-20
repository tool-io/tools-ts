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
  nInt,
  nWidth,
  nWrapped,
  nWrap,
  nPick,
  nDistinct,
  nIntersect,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type DialogueSubtextCardSetInput = NSeed & {
  readonly utterances: readonly {
    readonly id: string;
    readonly text: string;
    readonly tags: readonly string[];
  }[];
  readonly intentions: readonly {
    readonly id: string;
    readonly text: string;
    readonly tags: readonly string[];
  }[];
  readonly count: number;
  readonly wrapWidth: number;
};
export type DialogueSubtextCardSetOutput = NReplay & {
  readonly cards: readonly {
    readonly utteranceId: string;
    readonly utterance: NWrapped;
    readonly sampledIntentionId: string;
    readonly sampledIntention: NWrapped;
    readonly sharedTags: readonly string[];
    readonly compatibleIntentionIds: readonly string[];
  }[];
  readonly interpretation: string;
};
const tagged = nObject({ id: nId, text: nText, tags: nTags });
export const inputSchema = nInput({
  utterances: nArray(tagged, 16, 1),
  intentions: nArray(tagged, 16, 1),
  count: nInt(1, 32),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  cards: nArray(
    nObject({
      utteranceId: nId,
      utterance: nWrapped,
      sampledIntentionId: nId,
      sampledIntention: nWrapped,
      sharedTags: nTags,
      compatibleIntentionIds: nArray(nId, 16, 1),
    }),
    32,
    1,
  ),
  interpretation: {
    type: "string",
    const:
      "sampled fictional intention; compatible alternatives remain ambiguous",
  },
});
const isInput = (v: unknown): v is DialogueSubtextCardSetInput =>
  matchesModelInput(v, inputSchema);
export const calculateDialogueSubtextCardSet = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DialogueSubtextCardSetOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.utterances.map((e) => e.id),
      "utterances",
    );
    nDistinct(
      x.intentions.map((e) => e.id),
      "intentions",
    );
    for (const e of [...x.utterances, ...x.intentions])
      nDistinct(e.tags, "tags");
    const eligible = x.utterances.filter((u) =>
      x.intentions.some((i) => nIntersect(u.tags, i.tags).length),
    );
    if (!eligible.length)
      return simpleError(
        "intentions",
        "No supplied intention shares an utterance context tag.",
        "infeasible_context",
      );
    return {
      cards: Array.from({ length: x.count }, () => {
        const utterance = nPick(eligible, r),
          compatible = x.intentions.filter(
            (i) => nIntersect(utterance.tags, i.tags).length,
          ),
          intention = nPick(compatible, r);
        return {
          utteranceId: utterance.id,
          utterance: nWrap(utterance.text, x.wrapWidth),
          sampledIntentionId: intention.id,
          sampledIntention: nWrap(intention.text, x.wrapWidth),
          sharedTags: nIntersect(utterance.tags, intention.tags),
          compatibleIntentionIds: compatible.map((i) => i.id),
        };
      }),
      interpretation:
        "sampled fictional intention; compatible alternatives remain ambiguous",
    };
  });
export const dialogueSubtextCardSetExample = {
  input: {
    utterances: [{ id: "hold", text: "Hold this.", tags: ["trust"] }],
    intentions: [
      { id: "help", text: "Ask for help.", tags: ["trust"] },
      { id: "protect", text: "Protect a secret.", tags: ["trust"] },
    ],
    count: 1,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    cards: [
      {
        utteranceId: "hold",
        utterance: { text: "Hold this.", lineCount: 1 },
        sampledIntentionId: "help",
        sampledIntention: { text: "Ask for help.", lineCount: 1 },
        sharedTags: ["trust"],
        compatibleIntentionIds: ["help", "protect"],
      },
    ],
    interpretation:
      "sampled fictional intention; compatible alternatives remain ambiguous",
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  DialogueSubtextCardSetInput,
  DialogueSubtextCardSetOutput
>;
export const dialogueSubtextCardSetTool = createModelDefinition<
  DialogueSubtextCardSetInput,
  DialogueSubtextCardSetOutput
>({
  id: "random/dialogue-subtext-card-set",
  title: "Random Dialogue Subtext Card Set Generator",
  description:
    "Pair supplied utterances and fictional hidden intentions through explicit context tags while retaining every compatible interpretation and its ambiguity.",
  inputSchema,
  outputSchema,
  execute: calculateDialogueSubtextCardSet,
});
export const runDialogueSubtextCardSet = dialogueSubtextCardSetTool.execute;
export default dialogueSubtextCardSetTool;
