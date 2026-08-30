import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpaceEconomyChainInput = {
  readonly driverIds: ReadonlyArray<string>;
  readonly nextDriverIndices: ReadonlyArray<number>;
};

export type SpaceEconomyChainOutput = {
  readonly chains: ReadonlyArray<string>;
  readonly cycleDetected: boolean;
  readonly maximumChainLength: number;
};

export const buildSpaceEconomyDriverChains = (
  input: SpaceEconomyChainInput,
): SpaceEconomyChainOutput => {
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
      "Each driver must have one next-driver index.",
      "driver_data_length_mismatch",
    );
  const driverIds = input.driverIds.map((driverId, index) => {
    if (typeof driverId !== "string" || driverId.trim() === "")
      simpleError(
        `driverIds.${index}`,
        "Driver IDs must be nonempty strings.",
        "invalid_driver_id",
      );
    return driverId.trim();
  });
  if (new Set(driverIds).size !== driverIds.length)
    simpleError(
      "driverIds",
      "Driver IDs must be unique.",
      "duplicate_driver_id",
    );
  for (const [index, nextIndex] of input.nextDriverIndices.entries())
    if (
      !Number.isSafeInteger(nextIndex) ||
      nextIndex < -1 ||
      nextIndex >= driverIds.length
    )
      simpleError(
        `nextDriverIndices.${index}`,
        "Next indices must be -1 or a valid driver index.",
        "invalid_next_driver_index",
      );
  const linkedDriverIndices = new Set(
    input.nextDriverIndices.filter((nextIndex) => nextIndex >= 0),
  );
  const chains: string[] = [];
  let cycleDetected = driverIds.some((_, startIndex) => {
    const visitedDriverIndices = new Set<number>();
    let currentIndex = startIndex;
    while (currentIndex !== -1) {
      if (visitedDriverIndices.has(currentIndex)) return true;
      visitedDriverIndices.add(currentIndex);
      currentIndex = input.nextDriverIndices[currentIndex]!;
    }
    return false;
  });
  let maximumChainLength = 0;
  for (const [startIndex, startId] of driverIds.entries()) {
    if (linkedDriverIndices.has(startIndex)) continue;
    const path = [startId];
    const visitedDriverIndices = new Set<number>([startIndex]);
    let currentIndex = startIndex;
    while (true) {
      const nextIndex = input.nextDriverIndices[currentIndex]!;
      if (nextIndex === -1) break;
      path.push(driverIds[nextIndex]!);
      if (visitedDriverIndices.has(nextIndex)) {
        cycleDetected = true;
        break;
      }
      visitedDriverIndices.add(nextIndex);
      currentIndex = nextIndex;
    }
    maximumChainLength = Math.max(maximumChainLength, path.length);
    chains.push(path.join(" -> "));
  }
  return { chains, cycleDetected, maximumChainLength };
};

export const spaceEconomyChainExample = {
  input: {
    driverIds: ["Launch cost", "Access", "Markets", "Growth"],
    nextDriverIndices: [1, 2, 3, -1],
  },
  output: {
    chains: ["Launch cost -> Access -> Markets -> Growth"],
    cycleDetected: false,
    maximumChainLength: 4,
  },
} satisfies ToolExample<SpaceEconomyChainInput, SpaceEconomyChainOutput>;

export const spaceEconomyChainTool = createSimpleTool({
  calculate: (input) =>
    buildSpaceEconomyDriverChains({
      driverIds: input.driverIds as string[],
      nextDriverIndices: input.nextDriverIndices as number[],
    }),
  description:
    "Build space-economy driver chains and report their maximum length and any cycle encountered.",
  id: "futurology/space-economy-driver-implication-chain",
  inputs: [
    { id: "driverIds", kind: "stringList", label: "Driver IDs" },
    {
      description:
        "One -1 terminal marker or valid next-driver index per driver.",
      id: "nextDriverIndices",
      kind: "numberList",
      label: "Next driver indices",
    },
  ],
  outputs: [
    { id: "chains", kind: "stringList", label: "Driver chains" },
    { id: "cycleDetected", kind: "boolean", label: "Cycle detected" },
    {
      id: "maximumChainLength",
      kind: "integer",
      label: "Maximum chain length",
      minimum: 1,
    },
  ],
  title: "Space Economy Driver Implication Chain",
});

export const runSpaceEconomyChain = spaceEconomyChainTool.execute;
export default spaceEconomyChainTool;
