import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  instants,
  instant,
  aligned,
  mean,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly storyBeatLabels: readonly string[];
  readonly assignedUtc: readonly string[];
  readonly completedUtcOrEmpty: readonly string[];
}>;
export type Output = Readonly<{
  readonly observedBeatLabels: readonly string[];
  readonly completedStoryCounts: readonly number[];
  readonly meanCompletedTurnaroundHours: readonly number[];
  readonly incompleteStoryCounts: readonly number[];
}>;
const inputFields = [
  { id: "storyBeatLabels", label: "Story beat labels", kind: "stringList" },
  { id: "assignedUtc", label: "Assigned utc", kind: "stringList" },
  {
    id: "completedUtcOrEmpty",
    label: "Completed utc or empty",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.storyBeatLabels, input.assignedUtc, "storyBeatLabels");
  aligned(input.storyBeatLabels, input.completedUtcOrEmpty, "storyBeatLabels");
  if (
    !input.storyBeatLabels.length ||
    input.storyBeatLabels.some((s) => !s.trim())
  )
    simpleError("beats", "Explicit nonempty observed beat labels required.");
  const starts = instants(input.assignedUtc),
    durations = input.completedUtcOrEmpty.map((v, i) => {
      if (v === "") return -1;
      const end = instant(v);
      if (end < starts[i])
        simpleError("completion", "Completion must not precede assignment.");
      return (end - starts[i]) / 3600000;
    }),
    labels = [...new Set(input.storyBeatLabels)],
    completed = labels.map((s) =>
      durations.filter((v, i) => input.storyBeatLabels[i] === s && v >= 0),
    ),
    pending = labels.map(
      (s) =>
        durations.filter((v, i) => input.storyBeatLabels[i] === s && v < 0)
          .length,
    );
  return {
    observedBeatLabels: labels,
    completedStoryCounts: completed.map((r) => r.length),
    meanCompletedTurnaroundHours: completed.map((r) =>
      r.length ? mean(r) : -1,
    ),
    incompleteStoryCounts: pending,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  storyBeatLabels: ["city", "city", "science"],
  assignedUtc: [
    "2025-01-01T00:00:00Z",
    "2025-01-01T00:00:00Z",
    "2025-01-01T00:00:00Z",
  ],
  completedUtcOrEmpty: ["2025-01-01T02:00:00Z", "", "2025-01-01T06:00:00Z"],
} satisfies Input;
export const exampleOutput = {
  observedBeatLabels: ["city", "science"],
  completedStoryCounts: [1, 1],
  meanCompletedTurnaroundHours: [2, 6],
  incompleteStoryCounts: [1, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/story-turnaround-hours-beat-average-calculator",
  title: "Story Turnaround Hours Beat Average Calculator",
  description:
    "Audit actual assigned/completed UTC story durations by beat, retaining incomplete censoring and unavailable complete-case mean with −1; completed-only means are not unbiased all-story turnaround forecasts.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedBeatLabels",
      label: "Observed beat labels",
      kind: "stringList",
    },
    {
      id: "completedStoryCounts",
      label: "Completed story counts",
      kind: "numberList",
    },
    {
      id: "meanCompletedTurnaroundHours",
      label: "Mean completed turnaround hours",
      kind: "numberList",
    },
    {
      id: "incompleteStoryCounts",
      label: "Incomplete story counts",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      storyBeatLabels: value.storyBeatLabels as readonly string[],
      assignedUtc: value.assignedUtc as readonly string[],
      completedUtcOrEmpty: value.completedUtcOrEmpty as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
