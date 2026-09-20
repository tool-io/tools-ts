import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createModelDefinition } from "../../core/model-definition.js";
import * as w from "../m500b-world-common.js";

export type WorldResourceDepositLayoutInput = w.WSeed & {
  readonly cellIds: readonly string[];
  readonly edges: readonly w.WLink[];
  readonly resources: readonly {
    readonly id: string;
    readonly count: number;
    readonly forbidNeighborWithIds: readonly string[];
  }[];
};
export type WorldResourceDepositLayoutOutput = w.WMeta & {
  readonly cells: readonly {
    readonly id: string;
    readonly resourceId: string | null;
  }[];
  readonly edges: readonly w.WLink[];
  readonly resourceComponents: readonly {
    readonly id: string;
    readonly count: number;
    readonly components: number;
  }[];
};
export const inputSchema = w.wInput({
  cellIds: w.wArray(w.wId, 12, 1),
  edges: w.wArray(w.wLinkSchema, 64),
  resources: w.wArray(
    w.wObject({
      id: w.wId,
      count: w.wInt(0, 12),
      forbidNeighborWithIds: w.wArray(w.wId, 8),
    }),
    8,
    1,
  ),
});
export const outputSchema = w.wOutput({
  cells: w.wArray(
    w.wObject({ id: w.wId, resourceId: { anyOf: [w.wId, { type: "null" }] } }),
    12,
    1,
  ),
  edges: w.wArray(w.wLinkSchema, 64),
  resourceComponents: w.wArray(
    w.wObject({ id: w.wId, count: w.wInt(0, 12), components: w.wInt(0, 12) }),
    8,
    1,
  ),
});
const isInput = (v: unknown): v is WorldResourceDepositLayoutInput =>
  w.matchesModelInput(v, inputSchema);
export const calculateWorldResourceDepositLayout = (
  input: unknown,
  context?: ToolExecutionContext,
) =>
  w.wRun(
    input,
    inputSchema,
    isInput,
    outputSchema,
    context,
    (x, random): Omit<WorldResourceDepositLayoutOutput, keyof w.WMeta> => {
      w.wUnique(x.cellIds, "cellIds");
      w.wLinks(x.cellIds, x.edges, "edges");
      const ids = x.resources.map((r) => r.id);
      w.wUnique(ids, "resources");
      for (const r of x.resources)
        w.wRefs(r.forbidNeighborWithIds, ids, "resources");
      const total = x.resources.reduce((n, r) => n + r.count, 0);
      if (total > x.cellIds.length) return w.wInfeasible("resources");
      const slots = x.resources.flatMap((r) =>
          Array.from({ length: r.count }, () => r),
        ),
        placed = new Map<string, string>(),
        tick = w.wBudget();
      const forbidden = (a: string, b: string): boolean =>
        Boolean(
          x.resources
            .find((r) => r.id === a)
            ?.forbidNeighborWithIds.includes(b) ||
          x.resources
            .find((r) => r.id === b)
            ?.forbidNeighborWithIds.includes(a),
        );
      const solve = (i: number): boolean => {
        tick();
        if (i === slots.length) return true;
        const resource = slots[i];
        const available = x.cellIds.filter(
          (id) =>
            !placed.has(id) &&
            !x.edges.some((e) => {
              const other =
                e.from === id ? e.to : e.to === id ? e.from : undefined;
              const label = other === undefined ? undefined : placed.get(other);
              return label !== undefined && forbidden(resource.id, label);
            }),
        );
        for (const cell of random.shuffle(available)) {
          placed.set(cell, resource.id);
          if (solve(i + 1)) return true;
          placed.delete(cell);
        }
        return false;
      };
      if (!solve(0)) return w.wInfeasible();
      return {
        cells: x.cellIds.map((id) => ({
          id,
          resourceId: placed.get(id) ?? null,
        })),
        edges: x.edges.map((e) => ({ ...e })),
        resourceComponents: x.resources.map((r) => {
          const cells = x.cellIds.filter((id) => placed.get(id) === r.id);
          return {
            id: r.id,
            count: cells.length,
            components: w.wComponents(
              cells,
              x.edges.filter(
                (e) => cells.includes(e.from) && cells.includes(e.to),
              ),
            ),
          };
        }),
      };
    },
  );
export const worldResourceDepositLayoutExample = {
  input: {
    cellIds: ["a", "b", "c"],
    edges: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    resources: [
      {
        id: "amber",
        count: 2,
        forbidNeighborWithIds: ["amber"],
      },
      {
        id: "iron",
        count: 1,
        forbidNeighborWithIds: [],
      },
    ],
    seed: 42,
  },
  output: {
    cells: [
      {
        id: "a",
        resourceId: "amber",
      },
      {
        id: "b",
        resourceId: "iron",
      },
      {
        id: "c",
        resourceId: "amber",
      },
    ],
    edges: [
      {
        from: "a",
        to: "b",
      },
      {
        from: "b",
        to: "c",
      },
    ],
    resourceComponents: [
      {
        id: "amber",
        count: 2,
        components: 2,
      },
      {
        id: "iron",
        count: 1,
        components: 1,
      },
    ],
    fictional: true,
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} as const satisfies ToolExample<
  WorldResourceDepositLayoutInput,
  WorldResourceDepositLayoutOutput
>;
export const worldResourceDepositLayoutTool = createModelDefinition<
  WorldResourceDepositLayoutInput,
  WorldResourceDepositLayoutOutput
>({
  id: "random/world-resource-deposit-layout",
  title: "Random World Resource Deposit Layout Generator",
  description:
    "Place exact fictional resource quotas on a supplied cell graph under symmetric adjacency exclusions, reporting resource components; bounded nonuniform search, not geology.",
  inputSchema,
  outputSchema,
  execute: calculateWorldResourceDepositLayout,
});
export const runWorldResourceDepositLayout =
  worldResourceDepositLayoutTool.execute;
export default worldResourceDepositLayoutTool;
