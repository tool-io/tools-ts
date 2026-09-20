import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nTags,
  nInt,
  nWidth,
  nWrapped,
  nWrap,
  nSample,
  nDistinct,
  nSum,
  nTick,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type StoryPerspectiveRotationInput = NSeed & {
  readonly viewpoints: readonly {
    readonly id: string;
    readonly quota: number;
    readonly knownTags: readonly string[];
  }[];
  readonly chapters: readonly {
    readonly id: string;
    readonly requiredTags: readonly string[];
  }[];
  readonly wrapWidth: number;
};
type Quota = { readonly viewpointId: string; readonly remaining: number };
export type StoryPerspectiveRotationOutput = NReplay & {
  readonly chapters: readonly {
    readonly chapterId: string;
    readonly viewpointId: string;
    readonly requiredTags: readonly string[];
    readonly remainingQuotas: readonly Quota[];
    readonly brief: NWrapped;
  }[];
  readonly finalQuotas: readonly Quota[];
};
const quota = nObject({ viewpointId: nId, remaining: nInt(0, 32) });
export const inputSchema = nInput({
  viewpoints: nArray(
    nObject({ id: nId, quota: nInt(0, 32), knownTags: nTags }),
    16,
    1,
  ),
  chapters: nArray(nObject({ id: nId, requiredTags: nTags }), 32, 1),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  chapters: nArray(
    nObject({
      chapterId: nId,
      viewpointId: nId,
      requiredTags: nTags,
      remainingQuotas: nArray(quota, 16, 1),
      brief: nWrapped,
    }),
    32,
    1,
  ),
  finalQuotas: nArray(quota, 16, 1),
});
const isInput = (v: unknown): v is StoryPerspectiveRotationInput =>
  matchesModelInput(v, inputSchema);
export const calculateStoryPerspectiveRotation = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StoryPerspectiveRotationOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.viewpoints.map((v) => v.id),
      "viewpoints",
    );
    nDistinct(
      x.chapters.map((c) => c.id),
      "chapters",
    );
    for (const v of x.viewpoints)
      nDistinct(v.knownTags, "viewpoints.knownTags");
    for (const c of x.chapters)
      nDistinct(c.requiredTags, "chapters.requiredTags");
    if (
      nSum(
        x.viewpoints.map((v) => v.quota),
        "viewpoints.quota",
      ) !== x.chapters.length
    )
      return simpleError(
        "viewpoints.quota",
        "Exact quotas must sum to the chapter count.",
        "quota_mismatch",
      );
    const left = new Map(x.viewpoints.map((v) => [v.id, v.quota || 0])),
      chapters: StoryPerspectiveRotationOutput["chapters"][number][] = [],
      tick = nTick(),
      snapshot = (): Quota[] =>
        x.viewpoints.map((v) => ({
          viewpointId: v.id,
          remaining: left.get(v.id) ?? 0,
        }));
    const search = (): boolean => {
      tick();
      const c = x.chapters[chapters.length];
      if (!c) return true;
      const eligible = x.viewpoints.filter(
        (v) =>
          (left.get(v.id) ?? 0) > 0 &&
          c.requiredTags.every((t) => v.knownTags.includes(t)),
      );
      for (const v of nSample(eligible, eligible.length, r)) {
        const before = left.get(v.id) ?? 0;
        left.set(v.id, before - 1);
        chapters.push({
          chapterId: c.id,
          viewpointId: v.id,
          requiredTags: [...c.requiredTags],
          remainingQuotas: snapshot(),
          brief: nWrap(`Chapter ${c.id}: viewpoint ${v.id}.`, x.wrapWidth),
        });
        if (search()) return true;
        chapters.pop();
        left.set(v.id, before);
      }
      return false;
    };
    if (!search())
      return simpleError(
        "chapters",
        "No quota assignment satisfies chapter knowledge.",
        "infeasible_perspectives",
      );
    return { chapters, finalQuotas: snapshot() };
  });
export const storyPerspectiveRotationExample = {
  input: {
    viewpoints: [
      { id: "m", quota: 1, knownTags: ["map"] },
      { id: "i", quota: 1, knownTags: ["gate"] },
    ],
    chapters: [
      { id: "c1", requiredTags: ["gate"] },
      { id: "c2", requiredTags: ["map"] },
    ],
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    chapters: [
      {
        chapterId: "c1",
        viewpointId: "i",
        requiredTags: ["gate"],
        remainingQuotas: [
          { viewpointId: "m", remaining: 1 },
          { viewpointId: "i", remaining: 0 },
        ],
        brief: { text: "Chapter c1: viewpoint i.", lineCount: 1 },
      },
      {
        chapterId: "c2",
        viewpointId: "m",
        requiredTags: ["map"],
        remainingQuotas: [
          { viewpointId: "m", remaining: 0 },
          { viewpointId: "i", remaining: 0 },
        ],
        brief: { text: "Chapter c2: viewpoint m.", lineCount: 1 },
      },
    ],
    finalQuotas: [
      { viewpointId: "m", remaining: 0 },
      { viewpointId: "i", remaining: 0 },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  StoryPerspectiveRotationInput,
  StoryPerspectiveRotationOutput
>;
export const storyPerspectiveRotationTool = createModelDefinition<
  StoryPerspectiveRotationInput,
  StoryPerspectiveRotationOutput
>({
  id: "random/story-perspective-rotation",
  title: "Random Story Perspective Rotation Plan Generator",
  description:
    "Assign supplied viewpoints to chapters under exact appearance quotas and explicit knowledge requirements using bounded search and a remaining-quota trace.",
  inputSchema,
  outputSchema,
  execute: calculateStoryPerspectiveRotation,
});
export const runStoryPerspectiveRotation = storyPerspectiveRotationTool.execute;
export default storyPerspectiveRotationTool;
