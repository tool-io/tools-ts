import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startSeconds: number;
  readonly endSeconds: number;
};
export type Output = { readonly durationSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startSeconds: { type: "number" },
    endSeconds: { type: "number" },
  },
  required: ["startSeconds", "endSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { durationSeconds: { type: "number" } },
  required: ["durationSeconds"],
} as const;
/** Measure an explicitly recorded diary event interval without classifying neurological events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startSeconds, endSeconds } = request;
  const compute = (): Output => {
    H.domain(endSeconds >= startSeconds, "endSeconds");
    return { durationSeconds: endSeconds - startSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startSeconds: 100, endSeconds: 145 },
  output: { durationSeconds: 45 },
} satisfies ToolExample<Input, Output>;
export const neurologicDiaryEventDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neurology", "health and medicine"],
      keywords: ["neurology", "health and medicine"],
    },
    id: "neurology/neurologic-diary-event-duration",
    title: "Neurologic Diary Event Duration",
    description:
      "Measure an explicitly recorded diary event interval without classifying neurological events.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startSeconds: { type: "number" },
        endSeconds: { type: "number" },
      },
      required: ["startSeconds", "endSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { durationSeconds: { type: "number" } },
      required: ["durationSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "startSeconds",
          label: "Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endSeconds",
          label: "End Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = neurologicDiaryEventDurationTool.execute;
export default neurologicDiaryEventDurationTool;
