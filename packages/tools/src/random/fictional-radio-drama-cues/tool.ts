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
  nPick,
  nGroups,
  nDistinct,
  nRefs,
  nSum,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type FictionalRadioDramaCuesInput = NSeed & {
  readonly dialogue: readonly {
    readonly id: string;
    readonly speaker: string;
    readonly text: string;
    readonly seconds: number;
  }[];
  readonly sounds: readonly {
    readonly id: string;
    readonly description: string;
    readonly eligibleBeatIds: readonly string[];
    readonly offsetSeconds: number;
    readonly seconds: number;
  }[];
};
export type FictionalRadioDramaCuesOutput = NReplay & {
  readonly rundown: readonly {
    readonly id: string;
    readonly kind: "dialogue" | "sound";
    readonly beatId: string;
    readonly speaker: string | null;
    readonly text: string;
    readonly startSecond: number;
    readonly endSecond: number;
  }[];
  readonly totalSeconds: number;
  readonly cueGroups: readonly (readonly string[])[];
};
export const inputSchema = nInput({
  dialogue: nArray(
    nObject({ id: nId, speaker: nText, text: nText, seconds: nInt(1) }),
    32,
    1,
  ),
  sounds: nArray(
    nObject({
      id: nId,
      description: nText,
      eligibleBeatIds: nArray(nId, 32, 1),
      offsetSeconds: nInt(),
      seconds: nInt(1),
    }),
    32,
    1,
  ),
});
export const outputSchema = nOutput({
  rundown: nArray(
    nObject({
      id: nId,
      kind: { type: "string", enum: ["dialogue", "sound"] },
      beatId: nId,
      speaker: { anyOf: [nText, { type: "null" }] },
      text: nText,
      startSecond: nInt(),
      endSecond: nInt(1),
    }),
    64,
    2,
  ),
  totalSeconds: nInt(1),
  cueGroups: nArray(nArray(nId, 4, 1), 16, 1),
});
const isInput = (v: unknown): v is FictionalRadioDramaCuesInput =>
  matchesModelInput(v, inputSchema);
export const calculateFictionalRadioDramaCues = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<FictionalRadioDramaCuesOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    const ids = x.dialogue.map((d) => d.id);
    nDistinct([...ids, ...x.sounds.map((s) => s.id)], "cues");
    const totalSeconds = nSum(
      x.dialogue.map((d) => d.seconds),
      "dialogue.seconds",
    );
    let clock = 0;
    const dialogue = x.dialogue.map((d) => {
      const startSecond = clock;
      clock += d.seconds;
      return {
        id: d.id,
        kind: "dialogue" as const,
        beatId: d.id,
        speaker: d.speaker,
        text: d.text,
        startSecond,
        endSecond: clock,
      };
    });
    const sounds = x.sounds.map((s) => {
      nRefs(s.eligibleBeatIds, ids, "sounds.eligibleBeatIds");
      const span = nSum([s.offsetSeconds, s.seconds], "sounds.seconds"),
        eligible = dialogue.filter(
          (d) =>
            s.eligibleBeatIds.includes(d.id) &&
            span <= d.endSecond - d.startSecond,
        );
      if (!eligible.length)
        return simpleError(
          "sounds",
          "A sound does not fit any eligible dialogue interval.",
          "infeasible_sound_cue",
        );
      const beat = nPick(eligible, r),
        startSecond = nSum(
          [beat.startSecond, s.offsetSeconds],
          "sounds.offsetSeconds",
        );
      return {
        id: s.id,
        kind: "sound" as const,
        beatId: beat.id,
        speaker: null,
        text: s.description,
        startSecond,
        endSecond: nSum([startSecond, s.seconds], "sounds.seconds"),
      };
    });
    const rundown = [...dialogue, ...sounds].sort(
      (a, b) =>
        a.startSecond - b.startSecond ||
        (a.kind === b.kind ? 0 : a.kind === "dialogue" ? -1 : 1),
    );
    return {
      rundown,
      totalSeconds,
      cueGroups: nGroups(
        rundown.map((c) => c.id),
        4,
      ),
    };
  });
export const fictionalRadioDramaCuesExample = {
  input: {
    dialogue: [
      { id: "a", speaker: "Mara", text: "Listen.", seconds: 4 },
      { id: "b", speaker: "Ivo", text: "I hear it.", seconds: 3 },
    ],
    sounds: [
      {
        id: "bell",
        description: "Bell",
        eligibleBeatIds: ["a"],
        offsetSeconds: 1,
        seconds: 2,
      },
      {
        id: "wind",
        description: "Wind",
        eligibleBeatIds: ["b"],
        offsetSeconds: 0,
        seconds: 3,
      },
    ],
    seed: 42,
  },
  output: {
    rundown: [
      {
        id: "a",
        kind: "dialogue",
        beatId: "a",
        speaker: "Mara",
        text: "Listen.",
        startSecond: 0,
        endSecond: 4,
      },
      {
        id: "bell",
        kind: "sound",
        beatId: "a",
        speaker: null,
        text: "Bell",
        startSecond: 1,
        endSecond: 3,
      },
      {
        id: "b",
        kind: "dialogue",
        beatId: "b",
        speaker: "Ivo",
        text: "I hear it.",
        startSecond: 4,
        endSecond: 7,
      },
      {
        id: "wind",
        kind: "sound",
        beatId: "b",
        speaker: null,
        text: "Wind",
        startSecond: 4,
        endSecond: 7,
      },
    ],
    totalSeconds: 7,
    cueGroups: [["a", "bell", "b", "wind"]],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  FictionalRadioDramaCuesInput,
  FictionalRadioDramaCuesOutput
>;
export const fictionalRadioDramaCuesTool = createModelDefinition<
  FictionalRadioDramaCuesInput,
  FictionalRadioDramaCuesOutput
>({
  id: "random/fictional-radio-drama-cues",
  title: "Random Fictional Radio Drama Cue Sheet Generator",
  description:
    "Place supplied sound descriptions inside compatible dialogue intervals and return a timed synthetic rundown with stable simultaneous cues; audio playback remains app-owned.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalRadioDramaCues,
});
export const runFictionalRadioDramaCues = fictionalRadioDramaCuesTool.execute;
export default fictionalRadioDramaCuesTool;
