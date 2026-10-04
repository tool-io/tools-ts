import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = { readonly overlapDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "number" },
    firstEnd: { type: "number" },
    secondStart: { type: "number" },
    secondEnd: { type: "number" },
  },
  required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlapDuration: { type: "number" } },
  required: ["overlapDuration"],
} as const;
/** Measure the intersection duration of two half-open utterance intervals in one shared time unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstEnd >= firstStart && secondEnd >= secondStart, "firstEnd");
    return {
      overlapDuration: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 2, firstEnd: 8, secondStart: 6, secondEnd: 10 },
  output: { overlapDuration: 2 },
} satisfies ToolExample<Input, Output>;
export const conversationOverlapTwoUtterancesTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/conversation-overlap-two-utterances",
    title: "Conversation Overlap Two Utterances Tool",
    description:
      "Measure the intersection duration of two half-open utterance intervals in one shared time unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "number" },
        firstEnd: { type: "number" },
        secondStart: { type: "number" },
        secondEnd: { type: "number" },
      },
      required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { overlapDuration: { type: "number" } },
      required: ["overlapDuration"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEnd",
          label: "Second End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = conversationOverlapTwoUtterancesTool.execute;
export default conversationOverlapTwoUtterancesTool;
