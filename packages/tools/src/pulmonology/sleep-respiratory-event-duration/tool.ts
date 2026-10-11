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
/** Subtract explicitly marked sleep respiratory-event endpoints without classifying apnea, hypopnea, or severity. */
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
  input: { startSeconds: 100, endSeconds: 115 },
  output: { durationSeconds: 15 },
} satisfies ToolExample<Input, Output>;
export const sleepRespiratoryEventDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pulmonology", "health and medicine"],
      keywords: ["pulmonology", "health and medicine"],
    },
    id: "pulmonology/sleep-respiratory-event-duration",
    title: "Sleep Respiratory Event Duration",
    description:
      "Subtract explicitly marked sleep respiratory-event endpoints without classifying apnea, hypopnea, or severity.",
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
export const run = sleepRespiratoryEventDurationTool.execute;
export default sleepRespiratoryEventDurationTool;
