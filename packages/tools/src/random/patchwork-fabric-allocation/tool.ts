import {
  createModelDefinition,
  matchesModelInput,
  inputObject,
  outputObject,
  array,
  positive,
  integer,
  object,
  label,
  countsSchema,
  run,
  choices,
  budget,
  distinct,
  counts,
  finite,
  simpleError,
  type AcCount,
  type AcSeed,
  type AcReplay,
  type ToolExample,
  type ToolExecutionContext,
} from "../m500b-art-craft-common.js";
import { area } from "../m500b-art-craft-geometry.js";
export type PatchworkFabricAllocationInput = AcSeed & {
  readonly fabrics: readonly {
    readonly id: string;
    readonly quota: number;
    readonly directionTags: readonly string[];
  }[];
  readonly slots: readonly {
    readonly id: string;
    readonly width: number;
    readonly height: number;
    readonly requiredDirection: string;
  }[];
};
export type PatchworkFabricAllocationOutput = AcReplay & {
  readonly assignments: readonly {
    readonly slotId: string;
    readonly fabricId: string;
    readonly directionTag: string;
    readonly area: number;
  }[];
  readonly usageCounts: readonly AcCount[];
  readonly remainingQuotas: readonly {
    readonly id: string;
    readonly quota: number;
  }[];
  readonly allocatedArea: number;
};
export const inputSchema = inputObject({
  fabrics: array(
    object({
      id: label,
      quota: integer(0, 32),
      directionTags: array(label, 16, 1),
    }),
    16,
    1,
  ),
  slots: array(
    object({
      id: label,
      width: positive,
      height: positive,
      requiredDirection: label,
    }),
    32,
    1,
  ),
});
export const outputSchema = outputObject({
  assignments: array(
    object({
      slotId: label,
      fabricId: label,
      directionTag: label,
      area: positive,
    }),
    32,
    1,
  ),
  usageCounts: countsSchema,
  remainingQuotas: array(object({ id: label, quota: integer(0, 32) }), 16, 1),
  allocatedArea: positive,
});
const isInput = (v: unknown): v is PatchworkFabricAllocationInput =>
  matchesModelInput(v, inputSchema);
export const calculatePatchworkFabricAllocation = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  run(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<PatchworkFabricAllocationOutput, "randomness"> => {
      distinct(
        x.fabrics.map((f) => f.id),
        "fabrics",
      );
      distinct(
        x.slots.map((s) => s.id),
        "slots",
      );
      x.fabrics.forEach((f) => distinct(f.directionTags, "fabrics"));
      const remaining = x.fabrics.map((f) => f.quota),
        assignments: PatchworkFabricAllocationOutput["assignments"][number][] =
          [],
        tick = budget();
      const search = (i: number): boolean => {
        tick();
        if (i === x.slots.length) return true;
        const s = x.slots[i],
          candidates = x.fabrics
            .map((_, j) => j)
            .filter(
              (j) =>
                remaining[j] > 0 &&
                x.fabrics[j].directionTags.includes(s.requiredDirection),
            );
        for (const j of choices(candidates, random)) {
          remaining[j]--;
          assignments.push({
            slotId: s.id,
            fabricId: x.fabrics[j].id,
            directionTag: s.requiredDirection,
            area: area(s.width, s.height),
          });
          if (search(i + 1)) return true;
          assignments.pop();
          remaining[j]++;
        }
        return false;
      };
      if (!search(0))
        return simpleError(
          "fabrics",
          "No exact slot assignment satisfies fabric-use quotas and direction tags.",
          "infeasible_allocation",
        );
      return {
        assignments,
        usageCounts: counts(
          assignments.map((a) => a.fabricId),
          x.fabrics.map((f) => f.id),
        ),
        remainingQuotas: x.fabrics.map((f, j) => ({
          id: f.id,
          quota: finite(remaining[j]),
        })),
        allocatedArea: finite(assignments.reduce((s, a) => s + a.area, 0)),
      };
    },
  );
export const patchworkFabricAllocationExample = {
  input: {
    fabrics: [
      { id: "A", quota: 1, directionTags: ["horizontal"] },
      { id: "B", quota: 1, directionTags: ["vertical"] },
    ],
    slots: [
      { id: "left", width: 2, height: 2, requiredDirection: "horizontal" },
      { id: "right", width: 2, height: 2, requiredDirection: "vertical" },
    ],
    seed: 42,
  },
  output: {
    assignments: [
      { slotId: "left", fabricId: "A", directionTag: "horizontal", area: 4 },
      { slotId: "right", fabricId: "B", directionTag: "vertical", area: 4 },
    ],
    usageCounts: [
      { id: "A", count: 1 },
      { id: "B", count: 1 },
    ],
    remainingQuotas: [
      { id: "A", quota: 0 },
      { id: "B", quota: 0 },
    ],
    allocatedArea: 8,
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<
  PatchworkFabricAllocationInput,
  PatchworkFabricAllocationOutput
>;
export const patchworkFabricAllocationTool = createModelDefinition<
  PatchworkFabricAllocationInput,
  PatchworkFabricAllocationOutput
>({
  id: "random/patchwork-fabric-allocation",
  title: "Random Patchwork Fabric Allocation Plan Generator",
  description:
    "Allocate supplied fabric-use quotas to dimensioned block slots under caller direction tags with bounded exact assignment; quotas are block uses, not inferred shrinkage or fabric yardage.",
  inputSchema,
  outputSchema,
  execute: calculatePatchworkFabricAllocation,
});
export const runPatchworkFabricAllocation =
  patchworkFabricAllocationTool.execute;
export default patchworkFabricAllocationTool;
