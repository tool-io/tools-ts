import { calculatePermutations } from "../../list/permutations/tool.js";
import { calculate as mapEightCounts } from "../../dance/eight-count-phrase-beat-mapper/tool.js";
import {
  createModelDefinition,
  matchesModelInput,
  nInput,
  nOutput,
  nArray,
  nObject,
  nId,
  nInt,
  nAt,
  nPick,
  nDistinct,
  nSum,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type DanceMotifPermutationInput = NSeed & {
  readonly motifs: readonly {
    readonly id: string;
    readonly counts: number;
    readonly startTag: string;
    readonly endTag: string;
  }[];
  readonly requiredStartTag: string;
  readonly requiredEndTag: string;
  readonly countOneAudioBeatIndex: number;
  readonly audioBeatsPerDanceCount: number;
};
export type DanceMotifPermutationOutput = NReplay & {
  readonly motifs: readonly {
    readonly id: string;
    readonly startCount: number;
    readonly endCount: number;
    readonly phraseNumber: number;
    readonly oneBasedCount: number;
    readonly audioBeatIndex: number;
  }[];
  readonly compatibleOrderCount: number;
  readonly totalCounts: number;
};
export const inputSchema = nInput({
  motifs: nArray(
    nObject({ id: nId, counts: nInt(1), startTag: nId, endTag: nId }),
    6,
    1,
  ),
  requiredStartTag: nId,
  requiredEndTag: nId,
  countOneAudioBeatIndex: { type: "number", minimum: 0 },
  audioBeatsPerDanceCount: { type: "number", exclusiveMinimum: 0 },
});
export const outputSchema = nOutput({
  motifs: nArray(
    nObject({
      id: nId,
      startCount: nInt(),
      endCount: nInt(1),
      phraseNumber: nInt(1),
      oneBasedCount: nInt(1, 8),
      audioBeatIndex: { type: "number", minimum: 0 },
    }),
    6,
    1,
  ),
  compatibleOrderCount: nInt(1, 720),
  totalCounts: nInt(1),
});
const isInput = (v: unknown): v is DanceMotifPermutationInput =>
  matchesModelInput(v, inputSchema);
export const calculateDanceMotifPermutation = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DanceMotifPermutationOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(
      x.motifs.map((m) => m.id),
      "motifs",
    );
    const totalCounts = nSum(
      x.motifs.map((m) => m.counts),
      "motifs.counts",
    );
    // Six motifs bound complete enumeration to 720 orders; input positions are identities.
    const compatible = calculatePermutations({
      values: x.motifs.map((_, i) => i),
    }).permutations.filter((order) => {
      const first = nAt(x.motifs, nAt(order, 0)),
        last = nAt(x.motifs, nAt(order, order.length - 1));
      return (
        first.startTag === x.requiredStartTag &&
        last.endTag === x.requiredEndTag &&
        order.every(
          (index, i) =>
            i === 0 ||
            nAt(x.motifs, nAt(order, i - 1)).endTag ===
              nAt(x.motifs, index).startTag,
        )
      );
    });
    if (!compatible.length)
      return simpleError(
        "motifs",
        "No complete permutation meets endpoint and adjacent compatibility.",
        "infeasible_motif_order",
      );
    const order = nPick(compatible, r);
    let cursor = 0;
    const intervals = order.map((index) => {
      const m = nAt(x.motifs, index),
        startCount = cursor;
      cursor += m.counts;
      return { id: m.id, startCount, endCount: cursor };
    });
    if (intervals.some((m) => m.startCount > 1000000))
      return simpleError(
        "motifs.counts",
        "The reused eight-count mapper supports event starts through 1,000,000 counts.",
        "core_count_limit",
      );
    if (
      intervals.some(
        (m) =>
          !Number.isFinite(
            x.countOneAudioBeatIndex + m.startCount * x.audioBeatsPerDanceCount,
          ),
      )
    )
      return simpleError(
        "audioBeatsPerDanceCount",
        "Audio mapping exceeds finite arithmetic.",
        "nonfinite_mapping",
      );
    const mapped = mapEightCounts({
      choreographicEventCounts: intervals.map((m) => m.startCount),
      countOneAudioBeatIndex: x.countOneAudioBeatIndex,
      callerAudioBeatsPerDanceCount: x.audioBeatsPerDanceCount,
    });
    return {
      motifs: intervals.map((m, i) => ({
        ...m,
        phraseNumber: nAt(mapped.eventPhraseNumbers, i),
        oneBasedCount: nAt(mapped.eventOneBasedCountsWithinPhrase, i),
        audioBeatIndex: nAt(mapped.mappedAudioBeatIndices, i) || 0,
      })),
      compatibleOrderCount: compatible.length,
      totalCounts,
    };
  });
export const danceMotifPermutationExample = {
  input: {
    motifs: [
      { id: "a", counts: 4, startTag: "closed", endTag: "open" },
      { id: "b", counts: 4, startTag: "open", endTag: "closed" },
    ],
    requiredStartTag: "closed",
    requiredEndTag: "closed",
    countOneAudioBeatIndex: 2,
    audioBeatsPerDanceCount: 0.5,
    seed: 42,
  },
  output: {
    motifs: [
      {
        id: "a",
        startCount: 0,
        endCount: 4,
        phraseNumber: 1,
        oneBasedCount: 1,
        audioBeatIndex: 2,
      },
      {
        id: "b",
        startCount: 4,
        endCount: 8,
        phraseNumber: 1,
        oneBasedCount: 5,
        audioBeatIndex: 4,
      },
    ],
    compatibleOrderCount: 1,
    totalCounts: 8,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  DanceMotifPermutationInput,
  DanceMotifPermutationOutput
>;
export const danceMotifPermutationTool = createModelDefinition<
  DanceMotifPermutationInput,
  DanceMotifPermutationOutput
>({
  id: "random/dance-motif-permutation",
  title: "Random Dance Motif Permutation Exercise Generator",
  description:
    "Reorder up to six caller-approved movement IDs by exact start/end compatibility, enumerate through the permutation core, and delegate phrase/audio mapping; no movement instructions are generated.",
  inputSchema,
  outputSchema,
  execute: calculateDanceMotifPermutation,
});
export const runDanceMotifPermutation = danceMotifPermutationTool.execute;
export default danceMotifPermutationTool;
