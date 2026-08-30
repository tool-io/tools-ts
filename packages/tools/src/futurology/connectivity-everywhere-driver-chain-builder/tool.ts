import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConnectivityChainInput = {
  readonly driverIds: ReadonlyArray<string>;
  readonly nextDriverIndices: ReadonlyArray<number>;
};

export type ConnectivityChainOutput = {
  readonly chains: ReadonlyArray<string>;
  readonly cycleDetected: boolean;
  readonly rootCount: number;
  readonly terminalCount: number;
};

export const buildConnectivityEverywhereDriverChains = (
  input: ConnectivityChainInput,
): ConnectivityChainOutput => {
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
  const terminalDriverIndices = new Set<number>();
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
  for (let startIndex = 0; startIndex < driverIds.length; startIndex += 1) {
    if (linkedDriverIndices.has(startIndex)) continue;
    const path = [driverIds[startIndex]!];
    const visitedDriverIndices = new Set<number>([startIndex]);
    let currentIndex = startIndex;
    while (true) {
      const nextIndex = input.nextDriverIndices[currentIndex]!;
      if (nextIndex === -1) {
        terminalDriverIndices.add(currentIndex);
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
    chains,
    cycleDetected,
    rootCount: driverIds.length - linkedDriverIndices.size,
    terminalCount: terminalDriverIndices.size,
  };
};

export const connectivityChainExample = {
  input: {
    driverIds: ["Coverage", "Devices", "Services", "Outcomes"],
    nextDriverIndices: [1, 2, 3, -1],
  },
  output: {
    chains: ["Coverage -> Devices -> Services -> Outcomes"],
    cycleDetected: false,
    rootCount: 1,
    terminalCount: 1,
  },
} satisfies ToolExample<ConnectivityChainInput, ConnectivityChainOutput>;

export const connectivityChainTool = createSimpleTool({
  calculate: (input) =>
    buildConnectivityEverywhereDriverChains({
      driverIds: input.driverIds as string[],
      nextDriverIndices: input.nextDriverIndices as number[],
    }),
  description:
    "Build connectivity driver chains from next-index relationships and report root, terminal, and cycle information.",
  id: "futurology/connectivity-everywhere-driver-chain-builder",
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
    { id: "rootCount", kind: "integer", label: "Root drivers", minimum: 0 },
    {
      id: "terminalCount",
      kind: "integer",
      label: "Terminal drivers",
      minimum: 0,
    },
  ],
  title: "Connectivity Everywhere Driver Chain Builder",
});

export const runConnectivityChain = connectivityChainTool.execute;
export default connectivityChainTool;
