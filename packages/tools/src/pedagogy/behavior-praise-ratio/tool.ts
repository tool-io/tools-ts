import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly behaviorSpecificPraiseCount: number;
  readonly correctiveFeedbackCount: number;
  readonly requiredPraisePerCorrection: number;
}>;
export type Output = Readonly<{
  readonly praiseToCorrectionRatio: number;
  readonly meetsTarget: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.behaviorSpecificPraiseCount < 0 ||
    input.correctiveFeedbackCount < 0 ||
    input.requiredPraisePerCorrection < 0
  )
    simpleError(
      "behaviorSpecificPraiseCount",
      "Nonnegative observation counts and target ratio required.",
    );
  const praiseToCorrectionRatio =
    input.correctiveFeedbackCount === 0
      ? input.behaviorSpecificPraiseCount
      : input.behaviorSpecificPraiseCount / input.correctiveFeedbackCount;
  return {
    praiseToCorrectionRatio,
    meetsTarget:
      input.behaviorSpecificPraiseCount >=
      input.correctiveFeedbackCount * input.requiredPraisePerCorrection,
  };
};
export const exampleInput = {
  behaviorSpecificPraiseCount: 8,
  correctiveFeedbackCount: 2,
  requiredPraisePerCorrection: 4,
} satisfies Input;
export const exampleOutput = {
  praiseToCorrectionRatio: 4,
  meetsTarget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/behavior-praise-ratio",
  title: "Behavior Praise Ratio",
  description:
    "Audit behavior-specific praise against a caller-defined praise/correction target.",
  inputs: [
    {
      id: "behaviorSpecificPraiseCount",
      label: "Behavior specific praise count",
      kind: "number",
    },
    {
      id: "correctiveFeedbackCount",
      label: "Corrective feedback count",
      kind: "number",
    },
    {
      id: "requiredPraisePerCorrection",
      label: "Required praise per correction",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "praiseToCorrectionRatio",
      label: "Praise to correction ratio",
      kind: "number",
    },
    { id: "meetsTarget", label: "Meets target", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      behaviorSpecificPraiseCount: value.behaviorSpecificPraiseCount as number,
      correctiveFeedbackCount: value.correctiveFeedbackCount as number,
      requiredPraisePerCorrection: value.requiredPraisePerCorrection as number,
    }),
});
export const run = tool.execute;
export default tool;
