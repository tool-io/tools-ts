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
export type StageTableauCompositionInput = NSeed & {
  readonly performers: readonly string[];
  readonly zones: readonly { readonly id: string; readonly capacity: number }[];
  readonly poses: readonly {
    readonly id: string;
    readonly text: string;
    readonly allowedZoneIds: readonly string[];
  }[];
};
export type StageTableauCompositionOutput = NReplay & {
  readonly assignments: readonly {
    readonly performerId: string;
    readonly zoneId: string;
    readonly poseId: string;
    readonly pose: string;
  }[];
  readonly occupancy: readonly {
    readonly zoneId: string;
    readonly count: number;
    readonly capacity: number;
  }[];
  readonly rehearsalGroups: readonly (readonly string[])[];
  readonly callerReviewRequired: boolean;
};
export const inputSchema = nInput({
  performers: nArray(nId, 16, 1),
  zones: nArray(nObject({ id: nId, capacity: nInt(0, 16) }), 16, 1),
  poses: nArray(
    nObject({ id: nId, text: nText, allowedZoneIds: nArray(nId, 16, 1) }),
    16,
    1,
  ),
});
export const outputSchema = nOutput({
  assignments: nArray(
    nObject({ performerId: nId, zoneId: nId, poseId: nId, pose: nText }),
    16,
    1,
  ),
  occupancy: nArray(
    nObject({ zoneId: nId, count: nInt(0, 16), capacity: nInt(0, 16) }),
    16,
    1,
  ),
  rehearsalGroups: nArray(nArray(nId, 4, 1), 4, 1),
  callerReviewRequired: { type: "boolean", const: true },
});
const isInput = (v: unknown): v is StageTableauCompositionInput =>
  matchesModelInput(v, inputSchema);
export const calculateStageTableauComposition = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<StageTableauCompositionOutput> =>
  nRun(input, inputSchema, isInput, context, (x, r) => {
    nDistinct(x.performers, "performers");
    const zoneIds = x.zones.map((z) => z.id);
    nDistinct(zoneIds, "zones");
    nDistinct(
      x.poses.map((p) => p.id),
      "poses",
    );
    for (const p of x.poses)
      nRefs(p.allowedZoneIds, zoneIds, "poses.allowedZoneIds");
    if (
      nSum(
        x.zones.map((z) => z.capacity),
        "zones.capacity",
      ) < x.performers.length
    )
      return simpleError(
        "zones",
        "Total occupancy cannot fit all performers.",
        "infeasible_capacity",
      );
    const assignments: StageTableauCompositionOutput["assignments"][number][] =
        [],
      used = new Map<string, number>(),
      tick = nTick();
    const search = (): boolean => {
      tick();
      const performerId = x.performers[assignments.length];
      if (performerId === undefined) return true;
      const choices = x.zones
        .filter((z) => (used.get(z.id) ?? 0) < z.capacity)
        .flatMap((z) =>
          x.poses
            .filter((p) => p.allowedZoneIds.includes(z.id))
            .map((p) => ({ zoneId: z.id, poseId: p.id, pose: p.text })),
        );
      for (const c of nSample(choices, choices.length, r)) {
        const before = used.get(c.zoneId) ?? 0;
        used.set(c.zoneId, before + 1);
        assignments.push({ performerId, ...c });
        if (search()) return true;
        assignments.pop();
        used.set(c.zoneId, before);
      }
      return false;
    };
    if (!search())
      return simpleError(
        "poses",
        "No supplied pose/zone allocation fits all performers.",
        "infeasible_tableau",
      );
    return {
      assignments,
      occupancy: x.zones.map((z) => ({
        zoneId: z.id,
        count: used.get(z.id) ?? 0,
        capacity: z.capacity || 0,
      })),
      rehearsalGroups: nGroups(x.performers, 4),
      callerReviewRequired: true,
    };
  });
export const stageTableauCompositionExample = {
  input: {
    performers: ["a", "b"],
    zones: [
      { id: "left", capacity: 1 },
      { id: "right", capacity: 1 },
    ],
    poses: [
      {
        id: "sit",
        text: "Caller-approved seated pose",
        allowedZoneIds: ["left"],
      },
      {
        id: "stand",
        text: "Caller-approved standing pose",
        allowedZoneIds: ["right"],
      },
    ],
    seed: 42,
  },
  output: {
    assignments: [
      {
        performerId: "a",
        zoneId: "right",
        poseId: "stand",
        pose: "Caller-approved standing pose",
      },
      {
        performerId: "b",
        zoneId: "left",
        poseId: "sit",
        pose: "Caller-approved seated pose",
      },
    ],
    occupancy: [
      { zoneId: "left", count: 1, capacity: 1 },
      { zoneId: "right", count: 1, capacity: 1 },
    ],
    rehearsalGroups: [["a", "b"]],
    callerReviewRequired: true,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  StageTableauCompositionInput,
  StageTableauCompositionOutput
>;
export const stageTableauCompositionTool = createModelDefinition<
  StageTableauCompositionInput,
  StageTableauCompositionOutput
>({
  id: "random/stage-tableau-composition",
  title: "Random Stage Tableau Composition Brief Generator",
  description:
    "Assign supplied performers to allowed poses and stage zones under occupancy capacities using bounded search; sightlines and physical safety remain caller-reviewed.",
  inputSchema,
  outputSchema,
  execute: calculateStageTableauComposition,
});
export const runStageTableauComposition = stageTableauCompositionTool.execute;
export default stageTableauCompositionTool;
