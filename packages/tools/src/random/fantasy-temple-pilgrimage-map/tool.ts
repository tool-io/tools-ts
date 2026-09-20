import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";
import { calculateTopologicalSort } from "../../graph/topological-sort/tool.js";
export type FantasyTemplePilgrimageMapInput = w.WSeed & {
  readonly temples: readonly {
    readonly id: string;
    readonly ritualIds: readonly string[];
  }[];
  readonly travel: readonly w.WLink[];
  readonly prerequisites: readonly w.WLink[];
  readonly start: string;
  readonly visitCount: number;
  readonly requiredTempleIds: readonly string[];
};
export type FantasyTemplePilgrimageMapOutput = w.WMeta & {
  readonly steps: readonly {
    readonly number: number;
    readonly templeId: string;
    readonly ritualId: string;
  }[];
  readonly route: readonly string[];
  readonly satisfiedPrerequisites: readonly w.WLink[];
  readonly componentCount: number;
};
export const inputSchema = w.wInput({
  temples: w.wArray(
    w.wObject({ id: w.wId, ritualIds: w.wArray(w.wId, 16, 1) }),
    12,
    1,
  ),
  travel: w.wArray(w.wLinkSchema, 64),
  prerequisites: w.wArray(w.wLinkSchema, 64),
  start: w.wId,
  visitCount: w.wInt(1, 12),
  requiredTempleIds: w.wArray(w.wId, 12),
});
export const outputSchema = w.wOutput({
  steps: w.wArray(
    w.wObject({ number: w.wInt(1, 12), templeId: w.wId, ritualId: w.wId }),
    12,
    1,
  ),
  route: w.wArray(w.wId, 12, 1),
  satisfiedPrerequisites: w.wArray(w.wLinkSchema, 64),
  componentCount: w.wInt(1, 1),
});
const isInput = (v: unknown): v is FantasyTemplePilgrimageMapInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateFantasyTemplePilgrimageMap = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<FantasyTemplePilgrimageMapOutput, keyof w.WMeta> => {
      const ids = x.temples.map((t) => t.id);
      w.wUnique(ids, "temples");
      for (const t of x.temples) w.wUnique(t.ritualIds, "temples");
      w.wLinks(ids, x.travel, "travel", true);
      w.wLinks(ids, x.prerequisites, "prerequisites", true);
      w.wRef(x.start, ids, "start");
      w.wRefs(x.requiredTempleIds, ids, "requiredTempleIds");
      calculateTopologicalSort({ graph: w.wGraph(ids, x.prerequisites, true) });
      if (
        x.visitCount > ids.length ||
        x.requiredTempleIds.length > x.visitCount ||
        x.prerequisites.some((e) => e.to === x.start)
      )
        return w.wInfeasible();
      const route = [x.start],
        tick = w.wBudget();
      const solve = (): boolean => {
        tick();
        if (route.length === x.visitCount)
          return x.requiredTempleIds.every((id) => route.includes(id));
        const last = route[route.length - 1],
          choices = x.travel
            .filter(
              (e) =>
                e.from === last &&
                !route.includes(e.to) &&
                x.prerequisites
                  .filter((p) => p.to === e.to)
                  .every((p) => route.includes(p.from)),
            )
            .map((e) => e.to);
        for (const id of random.shuffle(choices)) {
          route.push(id);
          if (solve()) return true;
          route.pop();
        }
        return false;
      };
      if (!solve()) return w.wInfeasible();
      const rituals = new Map(x.temples.map((t) => [t.id, t.ritualIds]));
      const edges = route.slice(1).map((to, i) => ({ from: route[i], to }));
      return {
        steps: route.map((templeId, i) => ({
          number: i + 1,
          templeId,
          ritualId: random.pick(rituals.get(templeId) ?? []),
        })),
        route,
        satisfiedPrerequisites: x.prerequisites
          .filter((e) => route.includes(e.to))
          .map((e) => ({ ...e })),
        componentCount: w.wComponents(route, edges),
      };
    },
  );
export const fantasyTemplePilgrimageMapExample = {
  input: {
    temples: [
      {
        id: "a",
        ritualIds: ["light", "bell"],
      },
      {
        id: "b",
        ritualIds: ["walk"],
      },
      {
        id: "c",
        ritualIds: ["rest"],
      },
    ],
    travel: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "a",
        to: "c",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    prerequisites: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    start: "a",
    visitCount: 3,
    requiredTempleIds: ["c"],
    seed: 42,
  },
  output: {
    steps: [
      {
        number: 1,
        templeId: "a",
        ritualId: "bell",
      },
      {
        number: 2,
        templeId: "b",
        ritualId: "walk",
      },
      {
        number: 3,
        templeId: "c",
        ritualId: "rest",
      },
    ],
    route: ["a", "b", "c"],
    satisfiedPrerequisites: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    componentCount: 1,
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  FantasyTemplePilgrimageMapInput,
  FantasyTemplePilgrimageMapOutput
>;
export const fantasyTemplePilgrimageMapTool = createModelDefinition<
  FantasyTemplePilgrimageMapInput,
  FantasyTemplePilgrimageMapOutput
>({
  id: "random/fantasy-temple-pilgrimage-map",
  title: "Random Fantasy Temple Pilgrimage Map Generator",
  description:
    "Construct an exact distinct-temple directed pilgrimage obeying caller visit prerequisites and required destinations, then draw supplied ritual tags; fictional, bounded nonuniform search.",
  inputSchema,
  outputSchema,
  execute: calculateFantasyTemplePilgrimageMap,
});
export const runFantasyTemplePilgrimageMap =
  fantasyTemplePilgrimageMapTool.execute;
export default fantasyTemplePilgrimageMapTool;
