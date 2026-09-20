import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nText,
  nStringList,
  nInt,
  nPick,
  nSample,
  nGroups,
  nDistinct,
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
export type DialogueInterruptionCuesInput = NSeed & {
  readonly beats: readonly {
    readonly id: string;
    readonly speaker: string;
    readonly text: string;
    readonly seconds: number;
  }[];
  readonly signals: readonly string[];
  readonly interruptionCount: number;
  readonly minimumGapSeconds: number;
};
type TurnBoundary = {
  readonly afterBeatId: string;
  readonly beforeBeatId: string;
  readonly second: number;
};
export type DialogueInterruptionCuesOutput = NReplay & {
  readonly beats: readonly {
    readonly id: string;
    readonly speaker: string;
    readonly text: string;
    readonly startSecond: number;
    readonly endSecond: number;
  }[];
  readonly cues: readonly (TurnBoundary & { readonly signal: string })[];
  readonly rounds: readonly (readonly string[])[];
  readonly totalSeconds: number;
};
export const inputSchema = nInput({
  beats: nArray(
    nObject({ id: nId, speaker: nText, text: nText, seconds: nInt(1) }),
    32,
    2,
  ),
  signals: nStringList,
  interruptionCount: nInt(0, 31),
  minimumGapSeconds: nInt(),
});
export const outputSchema = nOutput({
  beats: nArray(
    nObject({
      id: nId,
      speaker: nText,
      text: nText,
      startSecond: nInt(),
      endSecond: nInt(1),
    }),
    32,
    2,
  ),
  cues: nArray(
    nObject({
      afterBeatId: nId,
      beforeBeatId: nId,
      second: nInt(1),
      signal: nText,
    }),
    31,
  ),
  rounds: nArray(nArray(nId, 4, 1), 8),
  totalSeconds: nInt(1),
});
const isInput = (v: unknown): v is DialogueInterruptionCuesInput =>
  matchesModelInput(v, inputSchema);
export const calculateDialogueInterruptionCues = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DialogueInterruptionCuesOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.beats.map((b) => b.id),
      "beats",
    );
    const totalSeconds = nSum(
      x.beats.map((b) => b.seconds),
      "beats.seconds",
    );
    let clock = 0;
    const beats = x.beats.map((b) => {
        const startSecond = clock;
        clock += b.seconds;
        return {
          id: b.id,
          speaker: b.speaker,
          text: b.text,
          startSecond,
          endSecond: clock,
        };
      }),
      boundaries: TurnBoundary[] = [];
    for (let i = 1; i < beats.length; i++) {
      const before = beats[i - 1],
        after = beats[i];
      if (!before || !after) throw new Error("missing beat");
      if (before.speaker !== after.speaker)
        boundaries.push({
          afterBeatId: before.id,
          beforeBeatId: after.id,
          second: before.endSecond,
        });
    }
    const selected: TurnBoundary[] = [],
      tick = nTick();
    const search = (): boolean => {
      tick();
      if (selected.length === x.interruptionCount) return true;
      const eligible = boundaries.filter(
        (b) =>
          !selected.includes(b) &&
          selected.every(
            (s) => Math.abs(b.second - s.second) >= x.minimumGapSeconds,
          ),
      );
      for (const b of nSample(eligible, eligible.length, r)) {
        selected.push(b);
        if (search()) return true;
        selected.pop();
      }
      return false;
    };
    if (!search())
      return simpleError(
        "interruptionCount",
        "No spaced subset of speaker-change boundaries has this size.",
        "infeasible_interruptions",
      );
    const cues = selected
      .sort((a, b) => a.second - b.second)
      .map((b) => ({ ...b, signal: nPick(x.signals, r) }));
    return {
      beats,
      cues,
      rounds: nGroups(
        cues.map((c) => c.afterBeatId),
        4,
      ),
      totalSeconds,
    };
  });
export const dialogueInterruptionCuesExample = {
  input: {
    beats: [
      { id: "a", speaker: "Mara", text: "Look.", seconds: 4 },
      { id: "b", speaker: "Ivo", text: "Where?", seconds: 3 },
      { id: "c", speaker: "Mara", text: "There.", seconds: 2 },
    ],
    signals: ["Bell"],
    interruptionCount: 1,
    minimumGapSeconds: 1,
    seed: 42,
  },
  output: {
    beats: [
      { id: "a", speaker: "Mara", text: "Look.", startSecond: 0, endSecond: 4 },
      { id: "b", speaker: "Ivo", text: "Where?", startSecond: 4, endSecond: 7 },
      {
        id: "c",
        speaker: "Mara",
        text: "There.",
        startSecond: 7,
        endSecond: 9,
      },
    ],
    cues: [{ afterBeatId: "b", beforeBeatId: "c", second: 7, signal: "Bell" }],
    rounds: [["b"]],
    totalSeconds: 9,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  DialogueInterruptionCuesInput,
  DialogueInterruptionCuesOutput
>;
export const dialogueInterruptionCuesTool = createModelDefinition<
  DialogueInterruptionCuesInput,
  DialogueInterruptionCuesOutput
>({
  id: "random/dialogue-interruption-cues",
  title: "Random Dialogue Interruption Cue Sheet Generator",
  description:
    "Place an exact spaced count of supplied interruption signals at speaker-change boundaries while preserving dialogue order and cumulative seconds.",
  inputSchema,
  outputSchema,
  execute: calculateDialogueInterruptionCues,
});
export const runDialogueInterruptionCues = dialogueInterruptionCuesTool.execute;
export default dialogueInterruptionCuesTool;
