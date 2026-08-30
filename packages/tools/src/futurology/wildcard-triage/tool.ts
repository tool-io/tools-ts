import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly confidencePercent: number;
  readonly plausibilityPercent: number;
  readonly impactPercent: number;
  readonly attentionThreshold: number;
}>;
export type Output = Readonly<{
  readonly triageScore: number;
  readonly priority: string;
  readonly meetsAttentionThreshold: boolean;
}>;

export const calculate = (input: Input): Output => {
  const triageScore =
    0.25 * input.confidencePercent +
    0.35 * input.plausibilityPercent +
    0.4 * input.impactPercent;
  return {
    triageScore,
    priority:
      triageScore >= 75
        ? "prepare"
        : triageScore >= 45
          ? "investigate"
          : "monitor",
    meetsAttentionThreshold: triageScore >= input.attentionThreshold,
  };
};

export const exampleInput = {
  confidencePercent: 40,
  plausibilityPercent: 60,
  impactPercent: 90,
  attentionThreshold: 60,
} satisfies Input;
export const exampleOutput = {
  triageScore: 67,
  priority: "investigate",
  meetsAttentionThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      confidencePercent: input.confidencePercent as number,
      plausibilityPercent: input.plausibilityPercent as number,
      impactPercent: input.impactPercent as number,
      attentionThreshold: input.attentionThreshold as number,
    }),
  description:
    "Score wildcard confidence, plausibility, and impact for triage.",
  id: "futurology/wildcard-triage",
  inputs: [
    {
      id: "confidencePercent",
      label: "Evidence confidence",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "plausibilityPercent",
      label: "Scenario plausibility",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "impactPercent",
      label: "Potential impact",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "attentionThreshold",
      label: "Attention threshold",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "triageScore",
      label: "Wildcard triage score",
      kind: "number",
      minimum: 0,
      maximum: 100,
    },
    {
      id: "priority",
      label: "Triage priority",
      kind: "string",
      enum: ["monitor", "investigate", "prepare"],
    },
    {
      id: "meetsAttentionThreshold",
      label: "Meets supplied threshold",
      kind: "boolean",
    },
  ],
  title: "Wildcard Triage",
});

export const run = tool.execute;
export default tool;
