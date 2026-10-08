import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workSubmittedSeconds: number;
  readonly feedbackReceivedSeconds: number;
};
export type Output = { readonly lagSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workSubmittedSeconds: { type: "number" },
    feedbackReceivedSeconds: { type: "number" },
  },
  required: ["workSubmittedSeconds", "feedbackReceivedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lagSeconds: { type: "number" } },
  required: ["lagSeconds"],
} as const;
/** Measure one recorded work-submission to feedback-receipt interval without inferring a learning outcome. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workSubmittedSeconds, feedbackReceivedSeconds } = request;
  const compute = (): Output => {
    H.domain(
      feedbackReceivedSeconds >= workSubmittedSeconds,
      "feedbackReceivedSeconds",
    );
    return { lagSeconds: feedbackReceivedSeconds - workSubmittedSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workSubmittedSeconds: 1000, feedbackReceivedSeconds: 4600 },
  output: { lagSeconds: 3600 },
} satisfies ToolExample<Input, Output>;
export const selfRegulatedLearningFeedbackLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "educational-psychology",
        "educational psychology",
        "psychology",
      ],
      keywords: ["educational psychology", "psychology"],
    },
    id: "educational-psychology/self-regulated-learning-feedback-lag",
    title: "Self Regulated Learning Feedback Lag",
    description:
      "Measure one recorded work-submission to feedback-receipt interval without inferring a learning outcome.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workSubmittedSeconds: { type: "number" },
        feedbackReceivedSeconds: { type: "number" },
      },
      required: ["workSubmittedSeconds", "feedbackReceivedSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lagSeconds: { type: "number" } },
      required: ["lagSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "workSubmittedSeconds",
          label: "Work Submitted Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feedbackReceivedSeconds",
          label: "Feedback Received Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lagSeconds",
          label: "Lag Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = selfRegulatedLearningFeedbackLagTool.execute;
export default selfRegulatedLearningFeedbackLagTool;
