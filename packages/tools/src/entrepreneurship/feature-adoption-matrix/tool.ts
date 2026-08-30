import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly featureIds: readonly string[];
  readonly activeUsers: readonly number[];
  readonly eventCounts: readonly number[];
  readonly eligibleUsers: number;
  readonly minimumReachFraction: number;
  readonly minimumEventsPerActive: number;
}>;
export type Output = Readonly<{
  readonly reachPercent: readonly number[];
  readonly eventsPerActive: readonly number[];
  readonly segments: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  const n = input.featureIds.length;
  if (
    !n ||
    n !== input.activeUsers.length ||
    n !== input.eventCounts.length ||
    new Set(input.featureIds).size !== n ||
    !Number.isSafeInteger(input.eligibleUsers) ||
    input.eligibleUsers <= 0 ||
    input.minimumReachFraction < 0 ||
    input.minimumReachFraction > 1 ||
    input.minimumEventsPerActive < 0 ||
    input.activeUsers.some(
      (v) => !Number.isSafeInteger(v) || v < 0 || v > input.eligibleUsers,
    ) ||
    input.eventCounts.some(
      (v, i) => !Number.isSafeInteger(v) || v < input.activeUsers[i],
    )
  )
    simpleError(
      "activeUsers",
      "Aligned feature counts, positive cohort and valid reach/depth cutoffs required.",
    );
  const reachPercent = input.activeUsers.map(
      (v) => (100 * v) / input.eligibleUsers,
    ),
    eventsPerActive = input.activeUsers.map((v, i) =>
      v === 0 ? 0 : input.eventCounts[i] / v,
    ),
    segments = input.featureIds.map((_, i) =>
      reachPercent[i] >= 100 * input.minimumReachFraction &&
      eventsPerActive[i] >= input.minimumEventsPerActive
        ? "core"
        : reachPercent[i] >= 100 * input.minimumReachFraction
          ? "broad-shallow"
          : eventsPerActive[i] >= input.minimumEventsPerActive
            ? "niche-deep"
            : "underused",
    );
  return { reachPercent, eventsPerActive, segments };
};
export const exampleInput = {
  featureIds: ["A", "B"],
  activeUsers: [5, 2],
  eventCounts: [20, 2],
  eligibleUsers: 10,
  minimumReachFraction: 0.4,
  minimumEventsPerActive: 2,
} satisfies Input;
export const exampleOutput = {
  reachPercent: [50, 20],
  eventsPerActive: [4, 1],
  segments: ["core", "underused"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/feature-adoption-matrix",
  title: "Feature Adoption Matrix",
  description:
    "Segment feature adoption by reach and usage depth using caller-defined cutoffs.",
  inputs: [
    { id: "featureIds", label: "Feature ids", kind: "stringList" },
    { id: "activeUsers", label: "Active users", kind: "numberList" },
    { id: "eventCounts", label: "Event counts", kind: "numberList" },
    { id: "eligibleUsers", label: "Eligible users", kind: "number" },
    {
      id: "minimumReachFraction",
      label: "Minimum reach fraction",
      kind: "number",
    },
    {
      id: "minimumEventsPerActive",
      label: "Minimum events per active",
      kind: "number",
    },
  ],
  outputs: [
    { id: "reachPercent", label: "Reach percent", kind: "numberList" },
    { id: "eventsPerActive", label: "Events per active", kind: "numberList" },
    { id: "segments", label: "Segments", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      featureIds: value.featureIds as readonly string[],
      activeUsers: value.activeUsers as readonly number[],
      eventCounts: value.eventCounts as readonly number[],
      eligibleUsers: value.eligibleUsers as number,
      minimumReachFraction: value.minimumReachFraction as number,
      minimumEventsPerActive: value.minimumEventsPerActive as number,
    }),
});
export const run = tool.execute;
export default tool;
