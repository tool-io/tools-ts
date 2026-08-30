import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MetaverseVerdictInput = {
  readonly crossPlatformInteroperabilityPercent: number;
  readonly taskCompletionImprovementPercent: number;
  readonly thirtyDayRetentionPercent: number;
  readonly utilityThresholdPercent: number;
};

export type MetaverseVerdictOutput = {
  readonly utilityScorePercent: number;
  readonly verdict: "hypeLed" | "mixed" | "utilityLed";
  readonly verdictRationale: string;
};

export const assessMetaverseHypeVersusUtility = (
  input: MetaverseVerdictInput,
): MetaverseVerdictOutput => {
  for (const [field, value] of [
    ["thirtyDayRetentionPercent", input.thirtyDayRetentionPercent],
    [
      "taskCompletionImprovementPercent",
      input.taskCompletionImprovementPercent,
    ],
    [
      "crossPlatformInteroperabilityPercent",
      input.crossPlatformInteroperabilityPercent,
    ],
    ["utilityThresholdPercent", input.utilityThresholdPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        "Verdict values must be finite values from 0 through 100.",
        "verdict_value_out_of_range",
      );
  const utilityScorePercent =
    (input.thirtyDayRetentionPercent +
      input.taskCompletionImprovementPercent +
      input.crossPlatformInteroperabilityPercent) /
    3;
  return {
    utilityScorePercent,
    verdict:
      utilityScorePercent >= input.utilityThresholdPercent + 15
        ? "utilityLed"
        : utilityScorePercent <= input.utilityThresholdPercent - 15
          ? "hypeLed"
          : "mixed",
    verdictRationale:
      "The verdict compares retention, task improvement, and interoperability rather than attention or investment volume alone.",
  };
};

export const metaverseVerdictExample = {
  input: {
    crossPlatformInteroperabilityPercent: 80,
    taskCompletionImprovementPercent: 70,
    thirtyDayRetentionPercent: 60,
    utilityThresholdPercent: 50,
  },
  output: {
    utilityScorePercent: 70,
    verdict: "utilityLed",
    verdictRationale:
      "The verdict compares retention, task improvement, and interoperability rather than attention or investment volume alone.",
  },
} satisfies ToolExample<MetaverseVerdictInput, MetaverseVerdictOutput>;

export const metaverseVerdictTool = createSimpleTool({
  calculate: (input) =>
    assessMetaverseHypeVersusUtility({
      crossPlatformInteroperabilityPercent:
        input.crossPlatformInteroperabilityPercent as number,
      taskCompletionImprovementPercent:
        input.taskCompletionImprovementPercent as number,
      thirtyDayRetentionPercent: input.thirtyDayRetentionPercent as number,
      utilityThresholdPercent: input.utilityThresholdPercent as number,
    }),
  description:
    "Classify metaverse hype versus utility from caller-supplied retention, task improvement, interoperability, and threshold values.",
  id: "futurology/metaverse-hype-versus-utility-verdict-lookup",
  inputs: [
    {
      id: "crossPlatformInteroperabilityPercent",
      kind: "number",
      label: "Cross-platform interoperability percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "taskCompletionImprovementPercent",
      kind: "number",
      label: "Task completion improvement percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "thirtyDayRetentionPercent",
      kind: "number",
      label: "Thirty-day retention percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "utilityThresholdPercent",
      kind: "number",
      label: "Utility threshold percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "utilityScorePercent",
      kind: "number",
      label: "Utility score percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      enum: ["hypeLed", "mixed", "utilityLed"],
      id: "verdict",
      kind: "string",
      label: "Hype versus utility verdict",
    },
    { id: "verdictRationale", kind: "string", label: "Verdict rationale" },
  ],
  title: "Metaverse Hype Versus Utility Verdict Lookup",
});

export const runMetaverseVerdict = metaverseVerdictTool.execute;
export default metaverseVerdictTool;
