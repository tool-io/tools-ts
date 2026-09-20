import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type FictionalTransitLineMapInput = w.WSeed & {
  readonly stationIds: readonly string[];
  readonly lineStopCounts: readonly number[];
};
export type FictionalTransitLineMapOutput = w.WMeta & {
  readonly lines: readonly {
    readonly id: string;
    readonly stops: readonly string[];
  }[];
  readonly links: readonly w.WLink[];
  readonly transferStationIds: readonly string[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  stationIds: w.wArray(w.wId, 16, 2),
  lineStopCounts: w.wArray(w.wInt(2, 16), 16, 1),
});
export const outputSchema = w.wOutput({
  lines: w.wArray(
    w.wObject({ id: w.wId, stops: w.wArray(w.wId, 16, 2) }),
    16,
    1,
  ),
  links: w.wArray(w.wLinkSchema, 120),
  transferStationIds: w.wArray(w.wId, 16),
  componentCount: w.wInt(1, 1),
});
const isInput = (v: unknown): v is FictionalTransitLineMapInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFictionalTransitLineMap = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FictionalTransitLineMapOutput, keyof w.WMeta> => {
      w.wUnique(x.stationIds, "stationIds");
      if (
        x.lineStopCounts.some((k) => k > x.stationIds.length) ||
        1 + x.lineStopCounts.reduce((sum, k) => sum + k - 1, 0) <
          x.stationIds.length
      )
        return w.wInfeasible("lineStopCounts");
      const shuffled = random.shuffle(x.stationIds),
        lines: { id: string; stops: string[] }[] = [],
        served: string[] = [];
      for (let i = 0; i < x.lineStopCounts.length; i++) {
        const count = x.lineStopCounts[i];
        const stops =
          i === 0 ? shuffled.slice(0, count) : [random.pick(served)];
        while (stops.length < count) {
          const unseen = shuffled.filter(
            (id) => !served.includes(id) && !stops.includes(id),
          );
          const bank = unseen.length
            ? unseen
            : shuffled.filter((id) => !stops.includes(id));
          stops.push(random.pick(bank));
        }
        lines.push({ id: "line-" + (i + 1), stops });
        for (const id of stops) if (!served.includes(id)) served.push(id);
      }
      const linksByKey = new Map<string, w.WLink>();
      for (const line of lines)
        for (let i = 1; i < line.stops.length; i++) {
          const edge = { from: line.stops[i - 1], to: line.stops[i] };
          if (!linksByKey.has(w.wKey(edge))) linksByKey.set(w.wKey(edge), edge);
        }
      const links = [...linksByKey.values()];
      return {
        lines,
        links,
        transferStationIds: x.stationIds.filter(
          (id) => lines.filter((l) => l.stops.includes(id)).length > 1,
        ),
        componentCount: w.wComponents(x.stationIds, links),
      };
    },
  );
export const fictionalTransitLineMapExample = {
  input: {
    stationIds: ["a", "b", "c"],
    lineStopCounts: [2, 2],
    seed: 42,
  },
  output: {
    lines: [
      {
        id: "line-1",
        stops: ["c", "a"],
      },
      {
        id: "line-2",
        stops: ["a", "b"],
      },
    ],
    links: [
      {
        from: "c",
        to: "a",
      },
      {
        from: "a",
        to: "b",
      },
    ],
    transferStationIds: ["a"],
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FictionalTransitLineMapInput,
  FictionalTransitLineMapOutput
>;
export const fictionalTransitLineMapTool = createModelDefinition<
  FictionalTransitLineMapInput,
  FictionalTransitLineMapOutput
>({
  id: "random/fictional-transit-line-map",
  title: "Random Fictional Transit Line Map Generator",
  description:
    "Construct connected imaginary transit lines with exact stop budgets, complete station coverage and transfer labels using nonuniform shared-anchor construction; no real schedules or geography.",
  inputSchema,
  outputSchema,
  execute: calculateFictionalTransitLineMap,
});
export const runFictionalTransitLineMap = fictionalTransitLineMapTool.execute;
export default fictionalTransitLineMapTool;
