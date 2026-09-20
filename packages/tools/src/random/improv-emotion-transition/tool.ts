import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nInt,
  nSample,
  nGroups,
  nDistinct,
  nRefs,
  nSum,
  nTick,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type ImprovEmotionTransitionInput = NSeed & {
  readonly emotions: readonly {
    readonly id: string;
    readonly label: string;
    readonly holdCounts: number;
  }[];
  readonly transitions: readonly {
    readonly id: string;
    readonly from: string;
    readonly to: string;
    readonly cue: string;
  }[];
  readonly startEmotionId: string;
  readonly segmentCount: number;
};
export type ImprovEmotionTransitionOutput = NReplay & {
  readonly segments: readonly {
    readonly emotionId: string;
    readonly label: string;
    readonly startCount: number;
    readonly endCount: number;
    readonly transitionId: string | null;
    readonly cue: string;
  }[];
  readonly rounds: readonly (readonly string[])[];
  readonly totalCounts: number;
};
export const inputSchema = nInput({
  emotions: nArray(
    nObject({ id: nId, label: nText, holdCounts: nInt(1) }),
    16,
    1,
  ),
  transitions: nArray(nObject({ id: nId, from: nId, to: nId, cue: nText }), 32),
  startEmotionId: nId,
  segmentCount: nInt(1, 32),
});
export const outputSchema = nOutput({
  segments: nArray(
    nObject({
      emotionId: nId,
      label: nText,
      startCount: nInt(),
      endCount: nInt(1),
      transitionId: { anyOf: [nId, { type: "null" }] },
      cue: { type: "string", maxLength: 1024 },
    }),
    32,
    1,
  ),
  rounds: nArray(nArray(nId, 2, 1), 16, 1),
  totalCounts: nInt(1),
});
const isInput = (v: unknown): v is ImprovEmotionTransitionInput =>
  matchesModelInput(v, inputSchema);
export const calculateImprovEmotionTransition = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<ImprovEmotionTransitionOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    const ids = x.emotions.map((e) => e.id);
    nDistinct(ids, "emotions");
    nDistinct(
      x.transitions.map((t) => t.id),
      "transitions",
    );
    nRefs([x.startEmotionId], ids, "startEmotionId");
    for (const t of x.transitions) {
      nRefs([t.from], ids, "transitions.from");
      nRefs([t.to], ids, "transitions.to");
      if (t.from === t.to)
        return simpleError(
          "transitions",
          "Emotion transition edges must change labels.",
          "self_transition",
        );
    }
    const segments: ImprovEmotionTransitionOutput["segments"][number][] = [],
      tick = nTick();
    const search = (
      id: string,
      startCount: number,
      transitionId: string | null,
      cue: string,
    ): boolean => {
      tick();
      const e = x.emotions.find((e) => e.id === id);
      if (!e) throw new Error("missing emotion");
      const endCount = nSum([startCount, e.holdCounts], "emotions.holdCounts");
      segments.push({
        emotionId: id,
        label: e.label,
        startCount,
        endCount,
        transitionId,
        cue,
      });
      if (segments.length === x.segmentCount) return true;
      const edges = x.transitions.filter((t) => t.from === id);
      for (const t of nSample(edges, edges.length, r))
        if (search(t.to, endCount, t.id, t.cue)) return true;
      segments.pop();
      return false;
    };
    if (!search(x.startEmotionId, 0, null, ""))
      return simpleError(
        "transitions",
        "No path supplies the requested segments.",
        "infeasible_emotion_path",
      );
    const last = segments[segments.length - 1];
    if (!last) throw new Error("missing segment");
    return {
      segments,
      rounds: nGroups(
        segments.map((s) => s.emotionId),
        2,
      ),
      totalCounts: last.endCount,
    };
  });
export const improvEmotionTransitionExample = {
  input: {
    emotions: [
      { id: "calm", label: "Calm", holdCounts: 2 },
      { id: "wonder", label: "Wonder", holdCounts: 3 },
    ],
    transitions: [
      { id: "notice", from: "calm", to: "wonder", cue: "Notice the letter" },
    ],
    startEmotionId: "calm",
    segmentCount: 2,
    seed: 42,
  },
  output: {
    segments: [
      {
        emotionId: "calm",
        label: "Calm",
        startCount: 0,
        endCount: 2,
        transitionId: null,
        cue: "",
      },
      {
        emotionId: "wonder",
        label: "Wonder",
        startCount: 2,
        endCount: 5,
        transitionId: "notice",
        cue: "Notice the letter",
      },
    ],
    rounds: [["calm", "wonder"]],
    totalCounts: 5,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  ImprovEmotionTransitionInput,
  ImprovEmotionTransitionOutput
>;
export const improvEmotionTransitionTool = createModelDefinition<
  ImprovEmotionTransitionInput,
  ImprovEmotionTransitionOutput
>({
  id: "random/improv-emotion-transition",
  title: "Random Improv Emotion Transition Sequence Generator",
  description:
    "Order supplied fictional emotion labels through explicit transition cues and hold counts using bounded search; no participant psychology is classified.",
  inputSchema,
  outputSchema,
  execute: calculateImprovEmotionTransition,
});
export const runImprovEmotionTransition = improvEmotionTransitionTool.execute;
export default improvEmotionTransitionTool;
