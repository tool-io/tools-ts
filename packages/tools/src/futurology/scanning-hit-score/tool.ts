import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly relevance: number;
  readonly impact: number;
  readonly timeframeUrgency: number;
  readonly novelty: number;
}>;
export type Output = Readonly<{
  readonly scorePercent: number;
  readonly priority: string;
}>;

export const calculate = (input: Input): Output => {
  const scorePercent =
    ((input.relevance + input.impact + input.timeframeUrgency + input.novelty) /
      20) *
    100;
  return {
    scorePercent,
    priority:
      scorePercent >= 75 ? "high" : scorePercent >= 40 ? "medium" : "low",
  };
};

export const exampleInput = {
  relevance: 5,
  impact: 4,
  timeframeUrgency: 3,
  novelty: 4,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  relevance: 1,
  impact: 1,
  timeframeUrgency: 1,
  novelty: 1,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      relevance: input.relevance as number,
      impact: input.impact as number,
      timeframeUrgency: input.timeframeUrgency as number,
      novelty: input.novelty as number,
    }),
  description:
    "Combine four caller ratings into a transparent scanning-hit priority score.",
  id: "futurology/scanning-hit-score",
  inputs: [
    {
      id: "relevance",
      label: "Relevance score",
      kind: "number",
      minimum: 0,
      maximum: 5,
    },
    {
      id: "impact",
      label: "Impact score",
      kind: "number",
      minimum: 0,
      maximum: 5,
    },
    {
      id: "timeframeUrgency",
      label: "Timeframe urgency",
      kind: "number",
      minimum: 0,
      maximum: 5,
    },
    {
      id: "novelty",
      label: "Novelty score",
      kind: "number",
      minimum: 0,
      maximum: 5,
    },
  ],
  outputs: [
    {
      id: "scorePercent",
      label: "Scanning-hit score",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "priority",
      label: "Priority",
      kind: "string",
      enum: ["low", "medium", "high"],
    },
  ],
  title: "Scanning Hit Score",
});

export const run = tool.execute;
export default tool;
