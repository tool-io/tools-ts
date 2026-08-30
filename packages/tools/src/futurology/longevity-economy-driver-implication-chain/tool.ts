import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LongevityChainInput = {
  readonly driverIds: ReadonlyArray<string>;
  readonly nextDriverIndices: ReadonlyArray<number>;
};

export type LongevityChainOutput = {
  readonly chainCount: number;
  readonly chains: ReadonlyArray<string>;
  readonly cycleDetected: boolean;
  readonly terminalDriverIds: ReadonlyArray<string>;
};

export const buildLongevityEconomyDriverChains = (
  input: LongevityChainInput,
): LongevityChainOutput => {
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
  const terminalDriverIds = new Set<string>();
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
  for (const [startIndex, startId] of driverIds.entries()) {
    if (linkedDriverIndices.has(startIndex)) continue;
    const path = [startId];
    const visitedDriverIndices = new Set<number>([startIndex]);
    let currentIndex = startIndex;
    while (true) {
      const nextIndex = input.nextDriverIndices[currentIndex]!;
      if (nextIndex === -1) {
        terminalDriverIds.add(driverIds[currentIndex]!);
        break;
      }
      path.push(driverIds[nextIndex]!);
      if (visitedDriverIndices.has(nextIndex)) {
        cycleDetected = true;
        break;
      }
      visitedDriverIndices.add(nextIndex);
      currentIndex = nextIndex;
    }
    chains.push(path.join(" -> "));
  }
  return {
    chainCount: chains.length,
    chains,
    cycleDetected,
    terminalDriverIds: [...terminalDriverIds],
  };
};

export const longevityChainExample = {
  input: {
    driverIds: ["Longevity", "Healthcare", "Work", "Consumption"],
    nextDriverIndices: [1, 2, 3, -1],
  },
  output: {
    chainCount: 1,
    chains: ["Longevity -> Healthcare -> Work -> Consumption"],
    cycleDetected: false,
    terminalDriverIds: ["Consumption"],
  },
} satisfies ToolExample<LongevityChainInput, LongevityChainOutput>;

export const longevityChainTool = createSimpleTool({
  calculate: (input) =>
    buildLongevityEconomyDriverChains({
      driverIds: input.driverIds as string[],
      nextDriverIndices: input.nextDriverIndices as number[],
    }),
  description:
    "Build longevity-economy driver chains from caller-supplied next indices and report terminal drivers and cycles.",
  id: "futurology/longevity-economy-driver-implication-chain",
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
    { id: "chainCount", kind: "integer", label: "Driver chains", minimum: 0 },
    { id: "chains", kind: "stringList", label: "Driver chains" },
    { id: "cycleDetected", kind: "boolean", label: "Cycle detected" },
    {
      id: "terminalDriverIds",
      kind: "stringList",
      label: "Terminal driver IDs",
    },
  ],
  title: "Longevity Economy Driver Implication Chain",
});

export const runLongevityChain = longevityChainTool.execute;
export default longevityChainTool;
