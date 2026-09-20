import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FantasyFestivalDistrictPlanInput = w.WSeed & {
  readonly districts: readonly {
    readonly id: string;
    readonly capacity: number;
    readonly allowedEventTypeIds: readonly string[];
  }[];
  readonly boundaries: readonly w.WLink[];
  readonly events: readonly { readonly id: string; readonly typeId: string }[];
  readonly requireConnectedOccupied: boolean;
};
export type FantasyFestivalDistrictPlanOutput = w.WMeta & {
  readonly assignments: readonly {
    readonly eventId: string;
    readonly districtId: string;
  }[];
  readonly districts: readonly {
    readonly id: string;
    readonly assignedCount: number;
    readonly remainingCapacity: number;
  }[];
  readonly occupiedComponentCount: number;
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  districts: w.wArray(
    w.wObject({
      id: w.wId,
      capacity: w.wInt(0, 32),
      allowedEventTypeIds: w.wArray(w.wId, 16),
    }),
    12,
    1,
  ),
  boundaries: w.wArray(w.wLinkSchema, 64),
  events: w.wArray(w.wObject({ id: w.wId, typeId: w.wId }), 32),
  requireConnectedOccupied: w.wBool,
});
export const outputSchema = w.wOutput({
  assignments: w.wArray(w.wObject({ eventId: w.wId, districtId: w.wId }), 32),
  districts: w.wArray(
    w.wObject({
      id: w.wId,
      assignedCount: w.wInt(0, 32),
      remainingCapacity: w.wInt(0, 32),
    }),
    12,
    1,
  ),
  occupiedComponentCount: w.wInt(0, 12),
  componentCount: w.wInt(1, 12),
});
const isInput = (v: unknown): v is FantasyFestivalDistrictPlanInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFantasyFestivalDistrictPlan = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FantasyFestivalDistrictPlanOutput, keyof w.WMeta> => {
      const ids = x.districts.map((d) => d.id);
      w.wUnique(ids, "districts");
      w.wLinks(ids, x.boundaries, "boundaries");
      w.wUnique(
        x.events.map((e) => e.id),
        "events",
      );
      for (const d of x.districts)
        w.wUnique(d.allowedEventTypeIds, "districts");
      if (x.events.length > x.districts.reduce((sum, d) => sum + d.capacity, 0))
        return w.wInfeasible();
      const assignments: { eventId: string; districtId: string }[] = [],
        tick = w.wBudget();
      const occupied = (): string[] =>
        ids.filter((id) => assignments.some((a) => a.districtId === id));
      const occupiedComponents = (): number => {
        const nodes = occupied();
        return w.wComponents(
          nodes,
          x.boundaries.filter(
            (e) => nodes.includes(e.from) && nodes.includes(e.to),
          ),
        );
      };
      const solve = (i: number): boolean => {
        tick();
        if (i === x.events.length)
          return !x.requireConnectedOccupied || occupiedComponents() <= 1;
        const event = x.events[i],
          choices = x.districts.filter(
            (d) =>
              d.allowedEventTypeIds.includes(event.typeId) &&
              assignments.filter((a) => a.districtId === d.id).length <
                d.capacity,
          );
        for (const d of random.shuffle(choices)) {
          assignments.push({ eventId: event.id, districtId: d.id });
          if (solve(i + 1)) return true;
          assignments.pop();
        }
        return false;
      };
      if (!solve(0)) return w.wInfeasible();
      return {
        assignments,
        districts: x.districts.map((d) => {
          const assignedCount = assignments.filter(
            (a) => a.districtId === d.id,
          ).length;
          return {
            id: d.id,
            assignedCount,
            remainingCapacity: d.capacity - assignedCount,
          };
        }),
        occupiedComponentCount: occupiedComponents(),
        componentCount: w.wComponents(ids, x.boundaries),
      };
    },
  );
export const fantasyFestivalDistrictPlanExample = {
  input: {
    districts: [
      {
        id: "a",
        capacity: 1,
        allowedEventTypeIds: ["music"],
      },
      {
        id: "b",
        capacity: 2,
        allowedEventTypeIds: ["music", "craft"],
      },
    ],
    boundaries: [
      {
        from: "a",
        to: "b",
      },
    ],
    events: [
      {
        id: "e1",
        typeId: "music",
      },
      {
        id: "e2",
        typeId: "craft",
      },
      {
        id: "e3",
        typeId: "craft",
      },
    ],
    requireConnectedOccupied: true,
    seed: 42,
  },
  output: {
    assignments: [
      {
        eventId: "e1",
        districtId: "a",
      },
      {
        eventId: "e2",
        districtId: "b",
      },
      {
        eventId: "e3",
        districtId: "b",
      },
    ],
    districts: [
      {
        id: "a",
        assignedCount: 1,
        remainingCapacity: 0,
      },
      {
        id: "b",
        assignedCount: 2,
        remainingCapacity: 0,
      },
    ],
    occupiedComponentCount: 1,
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FantasyFestivalDistrictPlanInput,
  FantasyFestivalDistrictPlanOutput
>;
export const fantasyFestivalDistrictPlanTool = createModelDefinition<
  FantasyFestivalDistrictPlanInput,
  FantasyFestivalDistrictPlanOutput
>({
  id: "random/fantasy-festival-district-plan",
  title: "Random Fantasy Festival District Plan Generator",
  description:
    "Allocate supplied fictional event types to capacity-limited districts with optional occupied-induced-graph connectivity; bounded nonuniform search, not crowd-safety planning.",
  inputSchema,
  outputSchema,
  execute: calculateFantasyFestivalDistrictPlan,
});
export const runFantasyFestivalDistrictPlan =
  fantasyFestivalDistrictPlanTool.execute;
export default fantasyFestivalDistrictPlanTool;
