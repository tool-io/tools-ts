import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nText,
  nId,
  nTags,
  nInt,
  nWidth,
  nWrapped,
  nWrap,
  nPick,
  nSample,
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
export type TaggedStoryEdge = {
  readonly id: string;
  readonly text: string;
  readonly tags: readonly string[];
};
export type StoryOpeningClosingPairInput = NSeed & {
  readonly openings: readonly TaggedStoryEdge[];
  readonly endings: readonly TaggedStoryEdge[];
  readonly distractorCount: number;
  readonly wrapWidth: number;
};
export type StoryOpeningClosingPairOutput = NReplay & {
  readonly opening: { readonly id: string; readonly body: NWrapped };
  readonly choices: readonly { readonly id: string; readonly body: NWrapped }[];
  readonly compatible: readonly {
    readonly endingId: string;
    readonly sharedTags: readonly string[];
  }[];
};
const edge = nObject({ id: nId, text: nText, tags: nTags });
export const inputSchema = nInput({
  openings: nArray(edge, 16, 1),
  endings: nArray(edge, 16, 1),
  distractorCount: nInt(0, 15),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  opening: nObject({ id: nId, body: nWrapped }),
  choices: nArray(nObject({ id: nId, body: nWrapped }), 16, 1),
  compatible: nArray(nObject({ endingId: nId, sharedTags: nTags }), 16, 1),
});
const isInput = (v: unknown): v is StoryOpeningClosingPairInput =>
  matchesModelInput(v, inputSchema);
export const calculateStoryOpeningClosingPair = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StoryOpeningClosingPairOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.openings.map((e) => e.id),
      "openings",
    );
    nDistinct(
      x.endings.map((e) => e.id),
      "endings",
    );
    for (const e of [...x.openings, ...x.endings]) nDistinct(e.tags, "tags");
    const eligible = x.openings.filter(
      (o) =>
        x.endings.some((e) => nIntersect(o.tags, e.tags).length) &&
        x.endings.filter((e) => !nIntersect(o.tags, e.tags).length).length >=
          x.distractorCount,
    );
    if (!eligible.length)
      return simpleError(
        "openings",
        "No opening has a compatible ending and enough incompatible distractors.",
        "infeasible_pair",
      );
    const opening = nPick(eligible, r),
      matches = x.endings.filter(
        (e) => nIntersect(opening.tags, e.tags).length,
      ),
      target = nPick(matches, r),
      distractors = nSample(
        x.endings.filter((e) => !nIntersect(opening.tags, e.tags).length),
        x.distractorCount,
        r,
      );
    return {
      opening: { id: opening.id, body: nWrap(opening.text, x.wrapWidth) },
      choices: nSample([target, ...distractors], 1 + x.distractorCount, r).map(
        (e) => ({ id: e.id, body: nWrap(e.text, x.wrapWidth) }),
      ),
      compatible: matches.map((e) => ({
        endingId: e.id,
        sharedTags: nIntersect(opening.tags, e.tags),
      })),
    };
  });
export const storyOpeningClosingPairExample = {
  input: {
    openings: [{ id: "door", text: "She left home.", tags: ["home"] }],
    endings: [
      { id: "return", text: "She returned.", tags: ["home"] },
      { id: "storm", text: "Waves rose.", tags: ["sea"] },
    ],
    distractorCount: 1,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    opening: { id: "door", body: { text: "She left home.", lineCount: 1 } },
    choices: [
      { id: "storm", body: { text: "Waves rose.", lineCount: 1 } },
      { id: "return", body: { text: "She returned.", lineCount: 1 } },
    ],
    compatible: [{ endingId: "return", sharedTags: ["home"] }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  StoryOpeningClosingPairInput,
  StoryOpeningClosingPairOutput
>;
export const storyOpeningClosingPairTool = createModelDefinition<
  StoryOpeningClosingPairInput,
  StoryOpeningClosingPairOutput
>({
  id: "random/story-opening-closing-pair",
  title: "Random Story Opening and Closing Pair Generator",
  description:
    "Match supplied fictional openings and endings by shared tags, shuffle incompatible distractors, and disclose every compatible ending including alternatives outside the choices.",
  inputSchema,
  outputSchema,
  execute: calculateStoryOpeningClosingPair,
});
export const runStoryOpeningClosingPair = storyOpeningClosingPairTool.execute;
export default storyOpeningClosingPairTool;
