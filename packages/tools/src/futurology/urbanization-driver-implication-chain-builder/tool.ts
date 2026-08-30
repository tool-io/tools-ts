import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UrbanizationDriverGraphInput = {
  readonly driverIds: ReadonlyArray<string>;
  readonly links: ReadonlyArray<ReadonlyArray<number>>;
  readonly rootDriverId: string;
};

export type UrbanizationDriverGraphOutput = {
  readonly disconnectedDriverIds: ReadonlyArray<string>;
  readonly reachableCount: number;
  readonly reachableDriverIds: ReadonlyArray<string>;
  readonly rootReachesAllDrivers: boolean;
};

export const traceUrbanizationDriverGraph = (
  input: UrbanizationDriverGraphInput,
): UrbanizationDriverGraphOutput => {
  if (!Array.isArray(input.driverIds) || input.driverIds.length === 0)
    simpleError(
      "driverIds",
      "At least one driver ID is required.",
      "driver_ids_required",
    );
  const ids = input.driverIds.map((id, index) => {
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `driverIds.${index}`,
        "Driver IDs must be nonempty strings.",
        "invalid_driver_id",
      );
    return id.trim();
  });
  if (
    typeof input.rootDriverId !== "string" ||
    !ids.includes(input.rootDriverId.trim())
  )
    simpleError(
      "rootDriverId",
      "Root driver must identify a listed driver.",
      "invalid_root_driver",
    );
  if (!Array.isArray(input.links) || input.links.length !== ids.length)
    simpleError(
      "links",
      "The link matrix must be square.",
      "invalid_driver_graph",
    );
  for (const [rowIndex, row] of input.links.entries()) {
    if (!Array.isArray(row) || row.length !== ids.length)
      simpleError(
        `links.${rowIndex}`,
        "The link matrix must be square.",
        "invalid_driver_graph",
      );
    for (const [columnIndex, link] of row.entries())
      if (link !== 0 && link !== 1)
        simpleError(
          `links.${rowIndex}.${columnIndex}`,
          "Links must be 0 or 1.",
          "invalid_driver_link",
        );
  }
  const rootIndex = ids.indexOf(input.rootDriverId.trim());
  const reachable = new Set<number>([rootIndex]);
  const queue = [rootIndex];
  for (let cursor = 0; cursor < queue.length; cursor += 1)
    for (let next = 0; next < ids.length; next += 1)
      if (input.links[queue[cursor]!]![next] === 1 && !reachable.has(next)) {
        reachable.add(next);
        queue.push(next);
      }
  const disconnectedDriverIds = ids.filter((_, index) => !reachable.has(index));
  return {
    disconnectedDriverIds,
    reachableCount: reachable.size,
    reachableDriverIds: [...reachable].map((index) => ids[index]!),
    rootReachesAllDrivers: reachable.size === ids.length,
  };
};

export const urbanizationDriverGraphExample = {
  input: {
    driverIds: ["Migration", "Housing", "Transit", "Jobs"],
    links: [
      [0, 1, 1, 0],
      [0, 0, 0, 1],
      [0, 0, 0, 1],
      [0, 0, 0, 0],
    ],
    rootDriverId: "Migration",
  },
  output: {
    disconnectedDriverIds: [],
    reachableCount: 4,
    reachableDriverIds: ["Migration", "Housing", "Transit", "Jobs"],
    rootReachesAllDrivers: true,
  },
} satisfies ToolExample<
  UrbanizationDriverGraphInput,
  UrbanizationDriverGraphOutput
>;

export const urbanizationDriverGraphTool = createSimpleTool({
  calculate: (input) =>
    traceUrbanizationDriverGraph({
      driverIds: input.driverIds as string[],
      links: input.links as number[][],
      rootDriverId: input.rootDriverId as string,
    }),
  description:
    "Trace all drivers reachable from a selected root in a caller-supplied binary driver-link matrix.",
  id: "futurology/urbanization-driver-implication-chain-builder",
  inputs: [
    { id: "driverIds", kind: "stringList", label: "Driver IDs" },
    {
      description: "Square directed-link matrix with binary values.",
      id: "links",
      kind: "matrix",
      label: "Driver links",
    },
    { id: "rootDriverId", kind: "string", label: "Root driver ID" },
  ],
  outputs: [
    {
      id: "disconnectedDriverIds",
      kind: "stringList",
      label: "Unreachable drivers",
    },
    {
      id: "reachableCount",
      kind: "integer",
      label: "Reachable drivers",
      minimum: 1,
    },
    {
      id: "reachableDriverIds",
      kind: "stringList",
      label: "Reachable driver IDs",
    },
    {
      id: "rootReachesAllDrivers",
      kind: "boolean",
      label: "Root reaches all drivers",
    },
  ],
  title: "Urbanization Driver Implication Chain Builder",
});

export const runUrbanizationDriverGraph = urbanizationDriverGraphTool.execute;
export default urbanizationDriverGraphTool;
