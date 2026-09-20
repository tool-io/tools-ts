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
export type ConstrainedMonologueChallengeInput = NSeed & {
  readonly topics: readonly string[];
  readonly tones: readonly string[];
  readonly vocabulary: readonly string[];
  readonly requiredWords: number;
  readonly minimumSeconds: number;
  readonly maximumSeconds: number;
  readonly wrapWidth: number;
};
export type ConstrainedMonologueChallengeOutput = NReplay & {
  readonly topic: string;
  readonly tone: string;
  readonly requiredVocabulary: readonly string[];
  readonly seconds: number;
  readonly brief: NWrapped;
};
export const inputSchema = nInput({
  topics: nStringList,
  tones: nStringList,
  vocabulary: nStringList,
  requiredWords: nInt(1, 16),
  minimumSeconds: nInt(1),
  maximumSeconds: nInt(1),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  topic: nText,
  tone: nText,
  requiredVocabulary: nArray(nText, 16, 1),
  seconds: nInt(1),
  brief: nWrapped,
});
const isInput = (value: unknown): value is ConstrainedMonologueChallengeInput =>
  matchesModelInput(value, inputSchema);
export const calculateConstrainedMonologueChallenge = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ConstrainedMonologueChallengeOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.vocabulary, "vocabulary");
    if (
      x.maximumSeconds < x.minimumSeconds ||
      !Number.isSafeInteger(x.maximumSeconds - x.minimumSeconds + 1)
    )
      return simpleError(
        "maximumSeconds",
        "Use ordered safe inclusive timing bounds.",
        "invalid_duration_range",
      );
    const topic = nPick(x.topics, r),
      tone = nPick(x.tones, r),
      requiredVocabulary = nSample(x.vocabulary, x.requiredWords, r),
      seconds = r.integer(x.minimumSeconds, x.maximumSeconds);
    return {
      topic,
      tone,
      requiredVocabulary,
      seconds,
      brief: nWrap(
        `Topic: ${topic}. Tone: ${tone}. Use: ${requiredVocabulary.join(", ")}. Time: ${seconds} seconds.`,
        x.wrapWidth,
      ),
    };
  });
export const constrainedMonologueChallengeExample = {
  input: {
    topics: ["harbor", "forest"],
    tones: ["bright", "hushed"],
    vocabulary: ["map", "bell"],
    requiredWords: 2,
    minimumSeconds: 45,
    maximumSeconds: 60,
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    topic: "forest",
    tone: "bright",
    requiredVocabulary: ["bell", "map"],
    seconds: 47,
    brief: {
      text: "Topic: forest. Tone: bright. Use: bell, map. Time: 47 seconds.",
      lineCount: 1,
    },
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ConstrainedMonologueChallengeInput,
  ConstrainedMonologueChallengeOutput
>;
export const constrainedMonologueChallengeTool = createModelDefinition<
  ConstrainedMonologueChallengeInput,
  ConstrainedMonologueChallengeOutput
>({
  id: "random/constrained-monologue-challenge",
  title: "Random Constrained Monologue Challenge Generator",
  description:
    "Draw supplied topic, tone, distinct vocabulary, and seconds into a wrapped performance brief and checklist; no speech is generated.",
  inputSchema,
  outputSchema,
  execute: calculateConstrainedMonologueChallenge,
});
export const runConstrainedMonologueChallenge =
  constrainedMonologueChallengeTool.execute;
export default constrainedMonologueChallengeTool;
