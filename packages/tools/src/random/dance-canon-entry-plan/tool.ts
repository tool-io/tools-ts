import { calculate as planCanon } from "../../dance/canon-offset-counts-planner/tool.js";
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
  nSample,
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
export type DanceCanonEntryPlanInput = NSeed & {
  readonly groups: readonly string[];
  readonly offsets: readonly number[];
  readonly motifCounts: number;
  readonly availableCounts: number;
};
export type DanceCanonEntryPlanOutput = NReplay & {
  readonly entries: readonly {
    readonly groupId: string;
    readonly startCount: number;
    readonly endCount: number;
  }[];
  readonly events: readonly {
    readonly count: number;
    readonly kind: "enter" | "exit";
    readonly groupId: string;
    readonly activeGroupsAfter: readonly string[];
  }[];
  readonly latestEndCount: number;
  readonly peakActiveGroups: number;
};
export const inputSchema = nInput({
  groups: nArray(nId, 16, 1),
  offsets: nArray(nInt(), 32, 1),
  motifCounts: nInt(1),
  availableCounts: nInt(1),
});
export const outputSchema = nOutput({
  entries: nArray(
    nObject({ groupId: nId, startCount: nInt(), endCount: nInt(1) }),
    16,
    1,
  ),
  events: nArray(
    nObject({
      count: nInt(),
      kind: { type: "string", enum: ["enter", "exit"] },
      groupId: nId,
      activeGroupsAfter: nArray(nId, 16),
    }),
    32,
    2,
  ),
  latestEndCount: nInt(1),
  peakActiveGroups: nInt(1, 16),
});
const isInput = (v: unknown): v is DanceCanonEntryPlanInput =>
  matchesModelInput(v, inputSchema);
export const calculateDanceCanonEntryPlan = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<DanceCanonEntryPlanOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.groups, "groups");
    if (x.offsets.some((v, i) => i > 0 && v <= nAt(x.offsets, i - 1)))
      return simpleError(
        "offsets",
        "Offset bank must be strictly increasing nonnegative counts.",
        "invalid_offsets",
      );
    const eligible = x.offsets.filter(
      (offset) =>
        BigInt(offset) + BigInt(x.motifCounts) <= BigInt(x.availableCounts),
    );
    if (eligible.length < x.groups.length)
      return simpleError(
        "offsets",
        "Not enough distinct offsets fit complete motifs in the available counts.",
        "infeasible_canon",
      );
    const offsets = nSample(eligible, x.groups.length, r).sort((a, b) => a - b),
      groups = nSample(x.groups, x.groups.length, r);
    offsets.forEach((offset) => nSum([offset, x.motifCounts], "motifCounts"));
    const planned = planCanon({
      callerDancerEntryOffsetCounts: offsets,
      callerMotifDurationCounts: x.motifCounts,
      callerAvailablePhraseCounts: x.availableCounts,
    });
    if (planned.entriesExceedingCallerPhraseIndices.length)
      throw new Error("Constructed canon exceeded the phrase window.");
    const entries = groups.map((groupId, i) => ({
        groupId,
        startCount: nAt(nAt(planned.plannedMotifCountIntervals, i), 0) || 0,
        endCount: nAt(nAt(planned.plannedMotifCountIntervals, i), 1),
      })),
      raw = entries
        .flatMap((e) => [
          { count: e.startCount, kind: "enter" as const, groupId: e.groupId },
          { count: e.endCount, kind: "exit" as const, groupId: e.groupId },
        ])
        .sort(
          (a, b) =>
            a.count - b.count ||
            (a.kind === b.kind ? 0 : a.kind === "exit" ? -1 : 1),
        ),
      active = new Set<string>();
    let peakActiveGroups = 0;
    const events = raw.map((e) => {
      if (e.kind === "enter") active.add(e.groupId);
      else active.delete(e.groupId);
      peakActiveGroups = Math.max(peakActiveGroups, active.size);
      return { ...e, activeGroupsAfter: [...active] };
    });
    return {
      entries,
      events,
      latestEndCount: planned.latestMotifEndCount,
      peakActiveGroups,
    };
  });
export const danceCanonEntryPlanExample = {
  input: {
    groups: ["a", "b"],
    offsets: [0, 2],
    motifCounts: 4,
    availableCounts: 6,
    seed: 42,
  },
  output: {
    entries: [
      { groupId: "b", startCount: 0, endCount: 4 },
      { groupId: "a", startCount: 2, endCount: 6 },
    ],
    events: [
      { count: 0, kind: "enter", groupId: "b", activeGroupsAfter: ["b"] },
      { count: 2, kind: "enter", groupId: "a", activeGroupsAfter: ["b", "a"] },
      { count: 4, kind: "exit", groupId: "b", activeGroupsAfter: ["a"] },
      { count: 6, kind: "exit", groupId: "a", activeGroupsAfter: [] },
    ],
    latestEndCount: 6,
    peakActiveGroups: 2,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<DanceCanonEntryPlanInput, DanceCanonEntryPlanOutput>;
export const danceCanonEntryPlanTool = createModelDefinition<
  DanceCanonEntryPlanInput,
  DanceCanonEntryPlanOutput
>({
  id: "random/dance-canon-entry-plan",
  title: "Random Dance Canon Entry Plan Generator",
  description:
    "Assign supplied groups to distinct staggered offsets, delegate complete motif intervals to the canon core, and return an event grid with half-open activity and exits before tied entries.",
  inputSchema,
  outputSchema,
  execute: calculateDanceCanonEntryPlan,
});
export const runDanceCanonEntryPlan = danceCanonEntryPlanTool.execute;
export default danceCanonEntryPlanTool;
