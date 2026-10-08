import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedbackCommand: number;
  readonly feedforwardCommand: number;
};
export type Output = { readonly combinedCommand: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedbackCommand: { type: "number" },
    feedforwardCommand: { type: "number" },
  },
  required: ["feedbackCommand", "feedforwardCommand"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { combinedCommand: { type: "number" } },
  required: ["combinedCommand"],
} as const;
/** Sum explicit signed feedback and feedforward commands in the same output unit without saturation or stability analysis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedbackCommand, feedforwardCommand } = request;
  const compute = (): Output => {
    return { combinedCommand: feedbackCommand + feedforwardCommand };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { feedbackCommand: 3, feedforwardCommand: 5 },
  output: { combinedCommand: 8 },
} satisfies ToolExample<Input, Output>;
export const feedbackFeedforwardScalarSumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cybernetics/feedback-feedforward-scalar-sum",
    title: "Feedback Feedforward Scalar Sum Tool",
    description:
      "Sum explicit signed feedback and feedforward commands in the same output unit without saturation or stability analysis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedbackCommand: { type: "number" },
        feedforwardCommand: { type: "number" },
      },
      required: ["feedbackCommand", "feedforwardCommand"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { combinedCommand: { type: "number" } },
      required: ["combinedCommand"],
    },
    ports: {
      inputs: [
        {
          id: "feedbackCommand",
          label: "Feedback Command",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "feedforwardCommand",
          label: "Feedforward Command",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "combinedCommand",
          label: "Combined Command",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = feedbackFeedforwardScalarSumTool.execute;
export default feedbackFeedforwardScalarSumTool;
