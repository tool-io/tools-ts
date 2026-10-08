import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly responseTime: number;
  readonly feedbackTime: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseTime: { type: "number" },
    feedbackTime: { type: "number" },
  },
  required: ["responseTime", "feedbackTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate supplied feedback-minus-response onset delay in matching monotonic units without assessing learning effects. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { responseTime, feedbackTime } = request;
  const compute = (): Output => {
    return { signedGap: feedbackTime - responseTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { responseTime: 12, feedbackTime: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const learningTrialFeedbackDelayOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/learning-trial-feedback-delay-offset",
    title: "Learning Trial Feedback Delay Offset Tool",
    description:
      "Calculate supplied feedback-minus-response onset delay in matching monotonic units without assessing learning effects.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        responseTime: { type: "number" },
        feedbackTime: { type: "number" },
      },
      required: ["responseTime", "feedbackTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "responseTime",
          label: "Response Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feedbackTime",
          label: "Feedback Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = learningTrialFeedbackDelayOffsetTool.execute;
export default learningTrialFeedbackDelayOffsetTool;
