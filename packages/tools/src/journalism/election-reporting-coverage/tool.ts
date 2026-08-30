import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly requiredTopics: readonly string[];
  readonly coveredTopics: readonly string[];
  readonly minimumSourcesPerTopic: number;
  readonly sourceCountsByRequiredTopic: readonly number[];
}>;
export type Output = Readonly<{
  readonly missingTopics: readonly string[];
  readonly underSourcedTopics: readonly string[];
  readonly topicCoveragePercent: number;
  readonly complete: boolean;
}>;

export const calculate = (input: Input): Output => {
  const required = input.requiredTopics
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  if (
    required.length === 0 ||
    input.sourceCountsByRequiredTopic.length !== required.length
  )
    simpleError(
      "requiredTopics",
      "Required topics and source counts must be aligned and nonempty.",
      "invalid_topics",
    );
  const covered = new Set(
    input.coveredTopics.map((value) => value.trim().toLowerCase()),
  );
  const missingTopics = required.filter((value) => !covered.has(value));
  const underSourcedTopics = required.filter(
    (value, index) =>
      covered.has(value) &&
      input.sourceCountsByRequiredTopic[index] < input.minimumSourcesPerTopic,
  );
  return {
    missingTopics,
    underSourcedTopics,
    topicCoveragePercent:
      ((required.length - missingTopics.length) / required.length) * 100,
    complete: missingTopics.length === 0 && underSourcedTopics.length === 0,
  };
};

export const exampleInput = {
  requiredTopics: ["access", "results", "process"],
  coveredTopics: ["access", "results"],
  minimumSourcesPerTopic: 2,
  sourceCountsByRequiredTopic: [2, 1, 0],
} satisfies Input;
export const exampleOutput = {
  missingTopics: ["process"],
  underSourcedTopics: ["results"],
  topicCoveragePercent: 66.66666666666666,
  complete: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      requiredTopics: input.requiredTopics as readonly string[],
      coveredTopics: input.coveredTopics as readonly string[],
      minimumSourcesPerTopic: input.minimumSourcesPerTopic as number,
      sourceCountsByRequiredTopic:
        input.sourceCountsByRequiredTopic as readonly number[],
    }),
  description: "Audit election-reporting topic and source-count coverage.",
  id: "journalism/election-reporting-coverage",
  inputs: [
    {
      id: "requiredTopics",
      label: "Required election-reporting topics",
      kind: "stringList",
    },
    {
      id: "coveredTopics",
      label: "Covered election-reporting topics",
      kind: "stringList",
    },
    {
      id: "minimumSourcesPerTopic",
      label: "Minimum sources per topic",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "sourceCountsByRequiredTopic",
      label: "Source counts in required-topic order",
      kind: "numberList",
    },
  ],
  outputs: [
    { id: "missingTopics", label: "Missing topics", kind: "stringList" },
    {
      id: "underSourcedTopics",
      label: "Under-sourced topics",
      kind: "stringList",
    },
    {
      id: "topicCoveragePercent",
      label: "Topic coverage",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "complete",
      label: "Topics and source minimums complete",
      kind: "boolean",
    },
  ],
  title: "Election Reporting Coverage",
});

export const run = tool.execute;
export default tool;
