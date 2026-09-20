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
  nWidth,
  nWrapped,
  nWrap,
  nSample,
  nDistinct,
  nRefs,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type NWrapped,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type NarrativeTimeOrderPuzzleInput = NSeed & {
  readonly events: readonly {
    readonly id: string;
    readonly text: string;
    readonly time: number;
    readonly predecessorIds: readonly string[];
  }[];
  readonly wrapWidth: number;
};
export type NarrativeTimeOrderPuzzleOutput = NReplay & {
  readonly presentation: readonly {
    readonly id: string;
    readonly body: NWrapped;
  }[];
  readonly chronology: readonly {
    readonly id: string;
    readonly time: number;
  }[];
  readonly dependencies: readonly {
    readonly from: string;
    readonly to: string;
  }[];
};
export const inputSchema = nInput({
  events: nArray(
    nObject({
      id: nId,
      text: nText,
      time: { type: "integer" },
      predecessorIds: nArray(nId, 31),
    }),
    32,
    2,
  ),
  wrapWidth: nWidth,
});
export const outputSchema = nOutput({
  presentation: nArray(nObject({ id: nId, body: nWrapped }), 32, 2),
  chronology: nArray(nObject({ id: nId, time: { type: "integer" } }), 32, 2),
  dependencies: nArray(nObject({ from: nId, to: nId }), 992),
});
const isInput = (v: unknown): v is NarrativeTimeOrderPuzzleInput =>
  matchesModelInput(v, inputSchema);
export const calculateNarrativeTimeOrderPuzzle = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<NarrativeTimeOrderPuzzleOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    const ids = x.events.map((e) => e.id);
    nDistinct(ids, "events");
    if (new Set(x.events.map((e) => e.time)).size !== x.events.length)
      return simpleError(
        "events",
        "Chronological ranks must be distinct.",
        "duplicate_times",
      );
    for (const e of x.events) {
      nRefs(e.predecessorIds, ids, "events.predecessorIds");
      if (
        e.predecessorIds.some((id) => {
          const prior = x.events.find((p) => p.id === id);
          return prior === undefined || prior.time >= e.time;
        })
      )
        return simpleError(
          "events",
          "Every predecessor must be strictly earlier.",
          "chronology_conflict",
        );
    }
    const ordered = [...x.events].sort((a, b) => (a.time < b.time ? -1 : 1)),
      presentation = nSample(x.events, x.events.length, r);
    if (presentation.every((e, i) => e.id === ordered[i]?.id)) {
      const first = presentation[0],
        second = presentation[1];
      if (!first || !second)
        throw new Error("A time-order puzzle requires two events.");
      presentation[0] = second;
      presentation[1] = first;
    }
    return {
      presentation: presentation.map((e) => ({
        id: e.id,
        body: nWrap(e.text, x.wrapWidth),
      })),
      chronology: ordered.map((e) => ({ id: e.id, time: e.time || 0 })),
      dependencies: x.events.flatMap((e) =>
        e.predecessorIds.map((from) => ({ from, to: e.id })),
      ),
    };
  });
export const narrativeTimeOrderPuzzleExample = {
  input: {
    events: [
      { id: "arrive", text: "A ship arrives.", time: 1, predecessorIds: [] },
      {
        id: "leave",
        text: "The ship leaves.",
        time: 2,
        predecessorIds: ["arrive"],
      },
    ],
    wrapWidth: 80,
    seed: 42,
  },
  output: {
    presentation: [
      { id: "leave", body: { text: "The ship leaves.", lineCount: 1 } },
      { id: "arrive", body: { text: "A ship arrives.", lineCount: 1 } },
    ],
    chronology: [
      { id: "arrive", time: 1 },
      { id: "leave", time: 2 },
    ],
    dependencies: [{ from: "arrive", to: "leave" }],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  NarrativeTimeOrderPuzzleInput,
  NarrativeTimeOrderPuzzleOutput
>;
export const narrativeTimeOrderPuzzleTool = createModelDefinition<
  NarrativeTimeOrderPuzzleInput,
  NarrativeTimeOrderPuzzleOutput
>({
  id: "random/narrative-time-order-puzzle",
  title: "Random Narrative Time Order Puzzle Generator",
  description:
    "Shuffle supplied fictional events and force nonchronological presentation by swapping the first pair if necessary, retaining chronology and strictly earlier dependency links.",
  inputSchema,
  outputSchema,
  execute: calculateNarrativeTimeOrderPuzzle,
});
export const runNarrativeTimeOrderPuzzle = narrativeTimeOrderPuzzleTool.execute;
export default narrativeTimeOrderPuzzleTool;
