import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DriverChainInput = {
  readonly driverIds: ReadonlyArray<string>;
  readonly nextDriverIndices: ReadonlyArray<number>;
};

export type DriverChainOutput = {
  readonly chains: ReadonlyArray<string>;
  readonly cycleDetected: boolean;
  readonly terminalCount: number;
};

export const buildDriverImplicationChains = (
  input: DriverChainInput,
): DriverChainOutput => {
  if (
    !Array.isArray(input.driverIds) ||
    !Array.isArray(input.nextDriverIndices)
  )
    simpleError(
      "",
      "Driver IDs and next indices must be arrays.",
      "driver_data_required",
    );
  if (
    input.driverIds.length === 0 ||
    input.driverIds.length !== input.nextDriverIndices.length
  )
    simpleError(
      "nextDriverIndices",
      "Each nonempty driver must have one next index.",
      "driver_data_length_mismatch",
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
  for (const [index, next] of input.nextDriverIndices.entries())
    if (!Number.isSafeInteger(next) || next < -1 || next >= ids.length)
      simpleError(
        `nextDriverIndices.${index}`,
        "Next indices must be -1 or a valid driver index.",
        "invalid_next_driver_index",
      );
  const targeted = new Set(
    input.nextDriverIndices.filter((index) => index >= 0),
  );
  const chains: string[] = [];
  const terminals = new Set<string>();
  let cycleDetected = ids.some((_, startIndex) => {
    const visited = new Set<number>();
    let currentIndex = startIndex;
    while (currentIndex !== -1) {
      if (visited.has(currentIndex)) return true;
      visited.add(currentIndex);
      currentIndex = input.nextDriverIndices[currentIndex]!;
    }
    return false;
  });
  for (const [start, id] of ids.entries()) {
    if (targeted.has(start)) continue;
    const path = [id];
    const visited = new Set<number>([start]);
    let current = start;
    for (;;) {
      const next = input.nextDriverIndices[current]!;
      if (next === -1) {
        terminals.add(ids[current]!);
        break;
      }
      if (visited.has(next)) {
        cycleDetected = true;
        path.push(ids[next]!);
        break;
      }
      visited.add(next);
      path.push(ids[next]!);
      current = next;
    }
    chains.push(path.join(" -> "));
  }
  return { chains, cycleDetected, terminalCount: terminals.size };
};

export const driverChainExample = {
  input: {
    driverIds: ["Births", "Labor force", "Consumption", "Savings"],
    nextDriverIndices: [1, 2, 3, -1],
  },
  output: {
    chains: ["Births -> Labor force -> Consumption -> Savings"],
    cycleDetected: false,
    terminalCount: 1,
  },
} satisfies ToolExample<DriverChainInput, DriverChainOutput>;

export const driverChainTool = createSimpleTool({
  calculate: (input) =>
    buildDriverImplicationChains({
      driverIds: input.driverIds as string[],
      nextDriverIndices: input.nextDriverIndices as number[],
    }),
  description:
    "Build implication chains from caller-supplied drivers and next-node indices, reporting terminals and detecting cycles.",
  id: "futurology/aging-population-driver-implication-chain",
  inputs: [
    { id: "driverIds", kind: "stringList", label: "Driver IDs" },
    {
      description: "One -1 or zero-based next-driver index per driver.",
      id: "nextDriverIndices",
      kind: "numberList",
      label: "Next driver indices",
    },
  ],
  outputs: [
    { id: "chains", kind: "stringList", label: "Implication chains" },
    { id: "cycleDetected", kind: "boolean", label: "Cycle detected" },
    {
      id: "terminalCount",
      kind: "integer",
      label: "Terminal drivers",
      minimum: 0,
    },
  ],
  title: "Aging Population Driver Implication Chain",
});

export const runDriverChain = driverChainTool.execute;
export default driverChainTool;
