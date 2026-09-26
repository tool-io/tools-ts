import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly submissionSeconds: number;
  readonly feedbackSeconds: number;
  readonly pauseSeconds: number;
};
export type Output = {
  readonly wallDelay: number;
  readonly activeDelay: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    submissionSeconds: { type: "number" },
    feedbackSeconds: { type: "number" },
    pauseSeconds: { type: "number", minimum: 0 },
  },
  required: ["submissionSeconds", "feedbackSeconds", "pauseSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wallDelay: { type: "number" },
    activeDelay: { type: "number" },
  },
  required: ["wallDelay", "activeDelay"],
} as const;
/** Calculate formative feedback delay one item from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { submissionSeconds, feedbackSeconds, pauseSeconds } = request;
  const compute = (): Output => {
    H.domain(
      feedbackSeconds >= submissionSeconds &&
        pauseSeconds >= 0 &&
        pauseSeconds <= feedbackSeconds - submissionSeconds,
    );
    return {
      wallDelay: feedbackSeconds - submissionSeconds,
      activeDelay: feedbackSeconds - submissionSeconds - pauseSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { submissionSeconds: 100, feedbackSeconds: 400, pauseSeconds: 60 },
  output: { wallDelay: 300, activeDelay: 240 },
} satisfies ToolExample<Input, Output>;
export const formativeFeedbackDelayOneItemTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/formative-feedback-delay-one-item",
    title: "Formative Feedback Delay One Item Tool",
    description:
      "Calculate formative feedback delay one item from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        submissionSeconds: { type: "number" },
        feedbackSeconds: { type: "number" },
        pauseSeconds: { type: "number", minimum: 0 },
      },
      required: ["submissionSeconds", "feedbackSeconds", "pauseSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wallDelay: { type: "number" },
        activeDelay: { type: "number" },
      },
      required: ["wallDelay", "activeDelay"],
    },
    ports: {
      inputs: [
        {
          id: "submissionSeconds",
          label: "Submission Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "feedbackSeconds",
          label: "Feedback Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "pauseSeconds",
          label: "Pause Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        { id: "wallDelay", label: "Wall Delay", valueType: { type: "number" } },
        {
          id: "activeDelay",
          label: "Active Delay",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = formativeFeedbackDelayOneItemTool.execute;
export default formativeFeedbackDelayOneItemTool;
