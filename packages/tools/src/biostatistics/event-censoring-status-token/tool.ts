import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventObserved: boolean;
  readonly observationEnded: boolean;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventObserved: { type: "boolean" },
    observationEnded: { type: "boolean" },
  },
  required: ["eventObserved", "observationEnded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Encode explicit event-observed and observation-ended flags while distinguishing ongoing follow-up from censoring. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventObserved, observationEnded } = request;
  const compute = (): Output => {
    return {
      status: eventObserved
        ? "event"
        : observationEnded
          ? "censored"
          : "ongoing",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventObserved: false, observationEnded: true },
  output: { status: "censored" },
} satisfies ToolExample<Input, Output>;
export const eventCensoringStatusTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biostatistics", "research and quality management"],
      keywords: ["biostatistics", "research and quality management"],
    },
    id: "biostatistics/event-censoring-status-token",
    title: "Event Censoring Status Token",
    description:
      "Encode explicit event-observed and observation-ended flags while distinguishing ongoing follow-up from censoring.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventObserved: { type: "boolean" },
        observationEnded: { type: "boolean" },
      },
      required: ["eventObserved", "observationEnded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "eventObserved",
          label: "Event Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "observationEnded",
          label: "Observation Ended",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = eventCensoringStatusTokenTool.execute;
export default eventCensoringStatusTokenTool;
