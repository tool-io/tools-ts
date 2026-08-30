import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WeakSignalHorizonInput = {
  readonly mediumHorizonEndYears: number;
  readonly nearHorizonEndYears: number;
  readonly signalHorizonYears: ReadonlyArray<number>;
  readonly signalIds: ReadonlyArray<string>;
};

export type WeakSignalHorizonOutput = {
  readonly assignments: ReadonlyArray<string>;
  readonly horizonCounts: ReadonlyArray<number>;
};

export const classifyWeakSignalHorizons = (
  input: WeakSignalHorizonInput,
): WeakSignalHorizonOutput => {
  for (const [field, value] of [
    ["nearHorizonEndYears", input.nearHorizonEndYears],
    ["mediumHorizonEndYears", input.mediumHorizonEndYears],
  ] as const)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        `${field} must be finite and nonnegative.`,
        "invalid_horizon_boundary",
      );
  if (input.nearHorizonEndYears >= input.mediumHorizonEndYears)
    simpleError(
      "mediumHorizonEndYears",
      "Medium-horizon end must follow near-horizon end.",
      "invalid_horizon_boundaries",
    );
  if (
    !Array.isArray(input.signalIds) ||
    !Array.isArray(input.signalHorizonYears)
  )
    simpleError(
      "",
      "Signal IDs and horizon years must be arrays.",
      "signal_data_required",
    );
  if (input.signalIds.length !== input.signalHorizonYears.length)
    simpleError(
      "signalHorizonYears",
      "Each signal must have one horizon year.",
      "signal_data_length_mismatch",
    );
  const assignments: string[] = [];
  const horizonCounts = [0, 0, 0];
  for (const [index, id] of input.signalIds.entries()) {
    const years = input.signalHorizonYears[index]!;
    if (typeof id !== "string" || id.trim() === "")
      simpleError(
        `signalIds.${index}`,
        "Signal IDs must be nonempty strings.",
        "invalid_signal_id",
      );
    if (!Number.isFinite(years) || years < 0)
      simpleError(
        `signalHorizonYears.${index}`,
        "Signal horizon years must be finite and nonnegative.",
        "invalid_signal_horizon",
      );
    const horizon =
      years <= input.nearHorizonEndYears
        ? 0
        : years <= input.mediumHorizonEndYears
          ? 1
          : 2;
    horizonCounts[horizon] += 1;
    assignments.push(`${id.trim()}: H${horizon + 1}`);
  }
  return { assignments, horizonCounts };
};

export const weakSignalHorizonExample = {
  input: {
    mediumHorizonEndYears: 10,
    nearHorizonEndYears: 3,
    signalHorizonYears: [1, 5, 12],
    signalIds: ["Automation", "Grid", "Fusion"],
  },
  output: {
    assignments: ["Automation: H1", "Grid: H2", "Fusion: H3"],
    horizonCounts: [1, 1, 1],
  },
} satisfies ToolExample<WeakSignalHorizonInput, WeakSignalHorizonOutput>;

export const weakSignalHorizonTool = createSimpleTool({
  calculate: (input) =>
    classifyWeakSignalHorizons({
      mediumHorizonEndYears: input.mediumHorizonEndYears as number,
      nearHorizonEndYears: input.nearHorizonEndYears as number,
      signalHorizonYears: input.signalHorizonYears as number[],
      signalIds: input.signalIds as string[],
    }),
  description:
    "Assign weak signals to near, medium, or far horizons using caller-supplied year boundaries.",
  id: "futurology/weak-signal-scanning-horizon-classifier",
  inputs: [
    {
      id: "mediumHorizonEndYears",
      kind: "number",
      label: "Medium-horizon end",
      minimum: 0,
    },
    {
      id: "nearHorizonEndYears",
      kind: "number",
      label: "Near-horizon end",
      minimum: 0,
    },
    {
      id: "signalHorizonYears",
      kind: "numberList",
      label: "Signal horizon years",
    },
    { id: "signalIds", kind: "stringList", label: "Signal IDs" },
  ],
  outputs: [
    { id: "assignments", kind: "stringList", label: "Horizon assignments" },
    { id: "horizonCounts", kind: "numberList", label: "Horizon counts" },
  ],
  title: "Weak Signal Scanning Horizon Classifier",
});

export const runWeakSignalHorizon = weakSignalHorizonTool.execute;
export default weakSignalHorizonTool;
