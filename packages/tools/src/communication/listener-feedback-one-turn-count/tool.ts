import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly feedbackEvents: number;
  readonly listenerSeconds: number;
};
export type Output = { readonly eventsPerMinute: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    feedbackEvents: { type: "integer", minimum: 0 },
    listenerSeconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["feedbackEvents", "listenerSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eventsPerMinute: { type: "number" } },
  required: ["eventsPerMinute"],
} as const;
/** Calculate listener feedback one turn count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { feedbackEvents, listenerSeconds } = request;
  const compute = (): Output => {
    H.integer(feedbackEvents, 0);
    H.positive(listenerSeconds);
    return { eventsPerMinute: (60 * feedbackEvents) / listenerSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { feedbackEvents: 6, listenerSeconds: 120 },
  output: { eventsPerMinute: 3 },
} satisfies ToolExample<Input, Output>;
export const listenerFeedbackOneTurnCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/listener-feedback-one-turn-count",
    title: "Listener Feedback One Turn Count Tool",
    description:
      "Calculate listener feedback one turn count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        feedbackEvents: { type: "integer", minimum: 0 },
        listenerSeconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["feedbackEvents", "listenerSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { eventsPerMinute: { type: "number" } },
      required: ["eventsPerMinute"],
    },
    ports: {
      inputs: [
        {
          id: "feedbackEvents",
          label: "Feedback Events",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "listenerSeconds",
          label: "Listener Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eventsPerMinute",
          label: "Events Per Minute",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = listenerFeedbackOneTurnCountTool.execute;
export default listenerFeedbackOneTurnCountTool;
