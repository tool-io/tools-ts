import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const stages = ["signal", "insight", "action", "completed"] as const;

export type SignalPipelineInput = {
  readonly actionIds: ReadonlyArray<string>;
  readonly currentStages: ReadonlyArray<string>;
  readonly insightIds: ReadonlyArray<string>;
  readonly signalIds: ReadonlyArray<string>;
};

export type SignalPipelineOutput = {
  readonly nextActions: ReadonlyArray<string>;
  readonly stageCounts: ReadonlyArray<number>;
  readonly stalledItemIds: ReadonlyArray<string>;
  readonly totalItemCount: number;
};

export const trackSignalInsightActionPipeline = (
  input: SignalPipelineInput,
): SignalPipelineOutput => {
  if (!Array.isArray(input.signalIds))
    simpleError(
      "signalIds",
      "Signal IDs must be an array.",
      "pipeline_lists_length_mismatch",
    );
  for (const [field, values] of [
    ["signalIds", input.signalIds],
    ["insightIds", input.insightIds],
    ["actionIds", input.actionIds],
    ["currentStages", input.currentStages],
  ] as const) {
    if (!Array.isArray(values) || values.length !== input.signalIds.length)
      simpleError(
        field,
        "Every pipeline item must have a signal, insight, action, and stage.",
        "pipeline_lists_length_mismatch",
      );
  }
  if (input.signalIds.length === 0)
    simpleError(
      "signalIds",
      "At least one pipeline item is required.",
      "pipeline_items_required",
    );
  const stageCounts = { signal: 0, insight: 0, action: 0, completed: 0 };
  const stalledItemIds: string[] = [];
  const nextActions: string[] = [];
  for (const [index, rawStage] of input.currentStages.entries()) {
    if (
      typeof rawStage !== "string" ||
      !stages.includes(rawStage.trim().toLowerCase() as (typeof stages)[number])
    )
      simpleError(
        `currentStages.${index}`,
        "Current stages must be signal, insight, action, or completed.",
        "invalid_pipeline_stage",
      );
    const stage = rawStage.trim().toLowerCase() as (typeof stages)[number];
    stageCounts[stage] += 1;
    const itemId = `${input.signalIds[index]}|${input.insightIds[index]}|${input.actionIds[index]}`;
    if (stage === "signal") {
      stalledItemIds.push(itemId);
      nextActions.push(
        `Interpret ${input.signalIds[index]} and test it against available evidence.`,
      );
    } else if (stage === "insight")
      nextActions.push(
        `Convert ${input.insightIds[index]} into a decision-relevant implication.`,
      );
    else if (stage === "action")
      nextActions.push(`Execute and review ${input.actionIds[index]}.`);
  }
  return {
    nextActions,
    stageCounts: stages.map((stage) => stageCounts[stage]),
    stalledItemIds,
    totalItemCount: input.signalIds.length,
  };
};

export const signalPipelineExample = {
  input: {
    actionIds: ["Launch pilot", "Update policy"],
    currentStages: ["insight", "completed"],
    insightIds: ["Demand may rise", "Rule clarified"],
    signalIds: ["New requests", "Guidance issued"],
  },
  output: {
    nextActions: [
      "Convert Demand may rise into a decision-relevant implication.",
    ],
    stageCounts: [0, 1, 0, 1],
    stalledItemIds: [],
    totalItemCount: 2,
  },
} satisfies ToolExample<SignalPipelineInput, SignalPipelineOutput>;

export const signalPipelineTool = createSimpleTool({
  calculate: (input) =>
    trackSignalInsightActionPipeline({
      actionIds: input.actionIds as string[],
      currentStages: input.currentStages as string[],
      insightIds: input.insightIds as string[],
      signalIds: input.signalIds as string[],
    }),
  description:
    "Track signal, insight, and action items through a four-stage pipeline and report counts, stalled items, and next actions.",
  id: "futurology/signal-insight-action-pipeline-stage-tracker",
  inputs: [
    { id: "actionIds", kind: "stringList", label: "Action IDs" },
    {
      description: "One signal, insight, action, or completed label per item.",
      id: "currentStages",
      kind: "stringList",
      label: "Current stages",
    },
    { id: "insightIds", kind: "stringList", label: "Insight IDs" },
    { id: "signalIds", kind: "stringList", label: "Signal IDs" },
  ],
  outputs: [
    { id: "nextActions", kind: "stringList", label: "Next actions" },
    { id: "stageCounts", kind: "numberList", label: "Stage counts" },
    {
      id: "stalledItemIds",
      kind: "stringList",
      label: "Items stalled at signal",
    },
    {
      id: "totalItemCount",
      kind: "integer",
      label: "Pipeline items",
      minimum: 1,
    },
  ],
  title: "Signal Insight Action Pipeline Stage Tracker",
});

export const runSignalPipeline = signalPipelineTool.execute;
export default signalPipelineTool;
