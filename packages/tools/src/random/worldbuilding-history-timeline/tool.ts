import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import { simpleError } from "../../core/simple.js";
import { calculateTopologicalSort } from "../../graph/topological-sort/tool.js";
import {
  generatedPlainDateSchema,
  generatedPlainDateAddDays,
  generatedPlainDateDifference,
} from "../calendar-day-construction.js";
import {
  fcArray,
  fcId,
  fcInput,
  fcInteger,
  fcObject,
  fcOutput,
  fcRun,
  fcText,
  fcUnique,
  matchesModelInput,
  type FcReplay,
  type FcSeed,
} from "../m250-fiction-craft-common.js";
export type WorldbuildingHistoryTimelineInput = FcSeed & {
  readonly startDate: string;
  readonly endDate: string;
  readonly minimumPredecessorGapDays: number;
  readonly events: readonly {
    readonly id: string;
    readonly text: string;
    readonly predecessorIds: readonly string[];
  }[];
};
export type WorldbuildingHistoryTimelineOutput = FcReplay & {
  readonly fictional: boolean;
  readonly intervalDays: number;
  readonly events: readonly {
    readonly id: string;
    readonly text: string;
    readonly date: string;
    readonly offsetDays: number;
    readonly predecessorIds: readonly string[];
  }[];
  readonly predecessorGaps: readonly {
    readonly from: string;
    readonly to: string;
    readonly days: number;
  }[];
};
export const inputSchema = fcInput({
  startDate: generatedPlainDateSchema,
  endDate: generatedPlainDateSchema,
  minimumPredecessorGapDays: fcInteger(),
  events: fcArray(
    fcObject({ id: fcId, text: fcText, predecessorIds: fcArray(fcId, 31) }),
    32,
    1,
  ),
});
export const outputSchema = fcOutput({
  fictional: { type: "boolean", const: true },
  intervalDays: fcInteger(),
  events: fcArray(
    fcObject({
      id: fcId,
      text: fcText,
      date: generatedPlainDateSchema,
      offsetDays: fcInteger(),
      predecessorIds: fcArray(fcId, 31),
    }),
    32,
    1,
  ),
  predecessorGaps: fcArray(
    fcObject({ from: fcId, to: fcId, days: fcInteger() }),
    992,
  ),
});
const isInput = (v: unknown): v is WorldbuildingHistoryTimelineInput =>
  matchesModelInput(v, inputSchema);
export const calculateWorldbuildingHistoryTimeline = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  fcRun(
    input,
    inputSchema,
    isInput,
    context,
    (x, random): Omit<WorldbuildingHistoryTimelineOutput, "randomness"> => {
      const ids = x.events.map((e) => e.id);
      fcUnique(ids, "events");
      for (const e of x.events) {
        fcUnique(e.predecessorIds, "events." + e.id + ".predecessorIds");
        if (e.predecessorIds.some((id) => !ids.includes(id)))
          simpleError(
            "events",
            "Every predecessor must reference a supplied event.",
            "invalid_reference",
          );
      }
      const intervalDays = generatedPlainDateDifference(
        x.startDate,
        x.endDate,
        "endDate",
      );
      if (intervalDays < 0)
        simpleError(
          "endDate",
          "The inclusive interval must be chronological.",
          "invalid_date_interval",
        );
      const graph = Object.fromEntries(
          ids.map((id) => [
            id,
            x.events
              .filter((e) => e.predecessorIds.includes(id))
              .map((e) => e.id),
          ]),
        ),
        order = calculateTopologicalSort({ graph }).order;
      const latest = new Map(ids.map((id) => [id, intervalDays]));
      for (const id of [...order].reverse())
        for (const child of graph[id])
          latest.set(
            id,
            Math.min(
              latest.get(id) ?? intervalDays,
              (latest.get(child) ?? intervalDays) - x.minimumPredecessorGapDays,
            ),
          );
      if ([...latest.values()].some((d) => d < 0))
        simpleError(
          "minimumPredecessorGapDays",
          "The predecessor chain cannot fit inside the supplied interval.",
          "infeasible_timeline",
        );
      const offsets = new Map<string, number>();
      for (const id of order) {
        const event = x.events.find((e) => e.id === id);
        if (!event) throw new Error("DAG referenced an unknown event");
        const earliest = Math.max(
          0,
          ...event.predecessorIds.map(
            (p) => (offsets.get(p) ?? 0) + x.minimumPredecessorGapDays,
          ),
        );
        offsets.set(
          id,
          random.integer(earliest, latest.get(id) ?? intervalDays),
        );
      }
      const events = x.events
        .map((e) => {
          const offsetDays = offsets.get(e.id);
          if (offsetDays === undefined)
            throw new Error("Missing generated date");
          return {
            ...e,
            predecessorIds: [...e.predecessorIds],
            offsetDays,
            date: generatedPlainDateAddDays(x.startDate, offsetDays, "events"),
          };
        })
        .sort(
          (a, b) =>
            a.offsetDays - b.offsetDays ||
            order.indexOf(a.id) - order.indexOf(b.id),
        );
      const predecessorGaps = events.flatMap((e) =>
        e.predecessorIds.map((from) => ({
          from,
          to: e.id,
          days: e.offsetDays - (offsets.get(from) ?? 0),
        })),
      );
      return { fictional: true, intervalDays, events, predecessorGaps };
    },
  );
export const worldbuildingHistoryTimelineExample = {
  input: {
    startDate: "2024-02-28",
    endDate: "2024-03-02",
    minimumPredecessorGapDays: 1,
    events: [
      { id: "arrival", text: "The lantern ship arrives", predecessorIds: [] },
      {
        id: "rebuild",
        text: "The harbor beacon is rebuilt",
        predecessorIds: ["arrival"],
      },
    ],
    seed: 42,
  },
  output: {
    fictional: true,
    intervalDays: 3,
    events: [
      {
        id: "arrival",
        text: "The lantern ship arrives",
        predecessorIds: [],
        offsetDays: 1,
        date: "2024-02-29",
      },
      {
        id: "rebuild",
        text: "The harbor beacon is rebuilt",
        predecessorIds: ["arrival"],
        offsetDays: 2,
        date: "2024-03-01",
      },
    ],
    predecessorGaps: [{ from: "arrival", to: "rebuild", days: 1 }],
    randomness: { seed: 42, source: "seed" },
  },
} as const satisfies ToolExample<
  WorldbuildingHistoryTimelineInput,
  WorldbuildingHistoryTimelineOutput
>;
export const worldbuildingHistoryTimelineTool = createModelDefinition<
  WorldbuildingHistoryTimelineInput,
  WorldbuildingHistoryTimelineOutput
>({
  id: "random/worldbuilding-history-timeline",
  title: "Random Worldbuilding History Timeline Generator",
  description:
    "Place supplied fictional events in an inclusive Gregorian date interval while reserving predecessor-gap slack through a verified DAG.",
  inputSchema,
  outputSchema,
  execute: calculateWorldbuildingHistoryTimeline,
});
export const runWorldbuildingHistoryTimeline =
  worldbuildingHistoryTimelineTool.execute;
export default worldbuildingHistoryTimelineTool;
