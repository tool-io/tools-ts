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
  nSample,
  nGroups,
  nDistinct,
  nRun,
  simpleError,
  type NSeed,
  type NReplay,
  type ToolExecutionContext,
  type ToolResult,
  type ToolExample,
} from "../m500b-narrative-support.js";
export type EnsemblePromptRelayInput = NSeed & {
  readonly participants: readonly string[];
  readonly fragments: readonly { readonly id: string; readonly text: string }[];
  readonly turns: number;
  readonly maximumFragmentAppearances: number;
};
export type EnsemblePromptRelayOutput = NReplay & {
  readonly participantCycle: readonly string[];
  readonly turns: readonly {
    readonly turn: number;
    readonly participantId: string;
    readonly fragmentId: string;
    readonly text: string;
    readonly receivedFrom: string | null;
    readonly handoffTo: string | null;
    readonly occurrence: number;
  }[];
  readonly fragmentUsage: readonly {
    readonly fragmentId: string;
    readonly count: number;
  }[];
  readonly rounds: readonly (readonly number[])[];
};
export const inputSchema = nInput({
  participants: nArray(nId, 16, 1),
  fragments: nArray(nObject({ id: nId, text: nText }), 16, 1),
  turns: nInt(1, 32),
  maximumFragmentAppearances: nInt(1, 32),
});
export const outputSchema = nOutput({
  participantCycle: nArray(nId, 16, 1),
  turns: nArray(
    nObject({
      turn: nInt(1, 32),
      participantId: nId,
      fragmentId: nId,
      text: nText,
      receivedFrom: { anyOf: [nId, { type: "null" }] },
      handoffTo: { anyOf: [nId, { type: "null" }] },
      occurrence: nInt(1, 32),
    }),
    32,
    1,
  ),
  fragmentUsage: nArray(
    nObject({ fragmentId: nId, count: nInt(0, 32) }),
    16,
    1,
  ),
  rounds: nArray(nArray(nInt(1, 32), 16, 1), 32, 1),
});
const isInput = (v: unknown): v is EnsemblePromptRelayInput =>
  matchesModelInput(v, inputSchema);
export const calculateEnsemblePromptRelay = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<EnsemblePromptRelayOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.participants, "participants");
    nDistinct(
      x.fragments.map((f) => f.id),
      "fragments",
    );
    if (x.turns > x.fragments.length * x.maximumFragmentAppearances)
      return simpleError(
        "turns",
        "Supplied fragment caps cannot supply all turns.",
        "infeasible_relay",
      );
    const participantCycle = nSample(x.participants, x.participants.length, r),
      usage = new Map<string, number>(),
      turns = Array.from({ length: x.turns }, (_, i) => {
        const fragment = nPick(
            x.fragments.filter(
              (f) => (usage.get(f.id) ?? 0) < x.maximumFragmentAppearances,
            ),
            r,
          ),
          occurrence = (usage.get(fragment.id) ?? 0) + 1;
        usage.set(fragment.id, occurrence);
        const participantId = participantCycle[i % participantCycle.length];
        if (participantId === undefined) throw new Error("missing participant");
        return {
          turn: i + 1,
          participantId,
          fragmentId: fragment.id,
          text: fragment.text,
          receivedFrom: i
            ? (participantCycle[(i - 1) % participantCycle.length] ?? null)
            : null,
          handoffTo:
            i + 1 < x.turns
              ? (participantCycle[(i + 1) % participantCycle.length] ?? null)
              : null,
          occurrence,
        };
      });
    return {
      participantCycle,
      turns,
      fragmentUsage: x.fragments.map((f) => ({
        fragmentId: f.id,
        count: usage.get(f.id) ?? 0,
      })),
      rounds: nGroups(
        turns.map((t) => t.turn),
        x.participants.length,
      ),
    };
  });
export const ensemblePromptRelayExample = {
  input: {
    participants: ["a", "b"],
    fragments: [
      { id: "map", text: "Find the map" },
      { id: "bell", text: "Hear the bell" },
    ],
    turns: 2,
    maximumFragmentAppearances: 1,
    seed: 42,
  },
  output: {
    participantCycle: ["b", "a"],
    turns: [
      {
        turn: 1,
        participantId: "b",
        fragmentId: "bell",
        text: "Hear the bell",
        receivedFrom: null,
        handoffTo: "a",
        occurrence: 1,
      },
      {
        turn: 2,
        participantId: "a",
        fragmentId: "map",
        text: "Find the map",
        receivedFrom: "b",
        handoffTo: null,
        occurrence: 1,
      },
    ],
    fragmentUsage: [
      { fragmentId: "map", count: 1 },
      { fragmentId: "bell", count: 1 },
    ],
    rounds: [[1, 2]],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<EnsemblePromptRelayInput, EnsemblePromptRelayOutput>;
export const ensemblePromptRelayTool = createModelDefinition<
  EnsemblePromptRelayInput,
  EnsemblePromptRelayOutput
>({
  id: "random/ensemble-prompt-relay",
  title: "Random Ensemble Prompt Relay Generator",
  description:
    "Assign supplied fragments to a shuffled cyclic participant order under exact fragment appearance caps and retain every handoff and occurrence.",
  inputSchema,
  outputSchema,
  execute: calculateEnsemblePromptRelay,
});
export const runEnsemblePromptRelay = ensemblePromptRelayTool.execute;
export default ensemblePromptRelayTool;
