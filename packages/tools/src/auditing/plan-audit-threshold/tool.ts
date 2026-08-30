import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly participantCount: number;
  readonly auditThreshold: number;
  readonly transitionBand: number;
}>;
export type Output = Readonly<{
  readonly thresholdMargin: number;
  readonly screenResult: string;
}>;

export const calculate = (input: Input): Output => {
  const thresholdMargin = input.participantCount - input.auditThreshold;
  return {
    thresholdMargin,
    screenResult:
      thresholdMargin >= 0
        ? "meets"
        : thresholdMargin >= -input.transitionBand
          ? "transition-review"
          : "below",
  };
};

export const exampleInput = {
  participantCount: 95,
  auditThreshold: 100,
  transitionBand: 10,
} satisfies Input;
export const exampleOutput = {
  thresholdMargin: -5,
  screenResult: "transition-review",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      participantCount: input.participantCount as number,
      auditThreshold: input.auditThreshold as number,
      transitionBand: input.transitionBand as number,
    }),
  description:
    "Compare plan participant count with caller-supplied audit and transition thresholds.",
  id: "auditing/plan-audit-threshold",
  inputs: [
    {
      id: "participantCount",
      label: "Plan participant count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "auditThreshold",
      label: "Caller audit threshold",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "transitionBand",
      label: "Threshold transition band",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "thresholdMargin",
      label: "Participant margin over threshold",
      kind: "integer",
    },
    {
      id: "screenResult",
      label: "Audit threshold result",
      kind: "string",
      enum: ["below", "transition-review", "meets"],
    },
  ],
  title: "Plan Audit Threshold",
});

export const run = tool.execute;
export default tool;
