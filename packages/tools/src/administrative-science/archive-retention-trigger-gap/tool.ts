import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly triggerAt: number;
  readonly recordAt: number;
  readonly suppliedRetention: number;
  readonly cutoff: number;
};
export type Output = { readonly expiry: number; readonly remaining: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    triggerAt: { type: "number" },
    recordAt: { type: "number" },
    suppliedRetention: { type: "number", minimum: 0 },
    cutoff: { type: "number" },
  },
  required: ["triggerAt", "recordAt", "suppliedRetention", "cutoff"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expiry: { type: "number" }, remaining: { type: "number" } },
  required: ["expiry", "remaining"],
} as const;
/** Compare a supplied retention trigger and interval to a cutoff without selecting records policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { triggerAt, recordAt, suppliedRetention, cutoff } = request;
  const compute = (): Output => {
    H.domain(triggerAt >= recordAt && suppliedRetention >= 0);
    return {
      expiry: triggerAt + suppliedRetention,
      remaining: triggerAt + suppliedRetention - cutoff,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { triggerAt: 20, recordAt: 10, suppliedRetention: 30, cutoff: 40 },
  output: { expiry: 50, remaining: 10 },
} satisfies ToolExample<Input, Output>;
export const archiveRetentionTriggerGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/archive-retention-trigger-gap",
    title: "Archive Retention Trigger Gap Tool",
    description:
      "Compare a supplied retention trigger and interval to a cutoff without selecting records policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        triggerAt: { type: "number" },
        recordAt: { type: "number" },
        suppliedRetention: { type: "number", minimum: 0 },
        cutoff: { type: "number" },
      },
      required: ["triggerAt", "recordAt", "suppliedRetention", "cutoff"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { expiry: { type: "number" }, remaining: { type: "number" } },
      required: ["expiry", "remaining"],
    },
    ports: {
      inputs: [
        {
          id: "triggerAt",
          label: "Trigger At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordAt",
          label: "Record At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRetention",
          label: "Supplied Retention",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cutoff",
          label: "Cutoff",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "expiry", label: "Expiry", valueType: { type: "number" } },
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = archiveRetentionTriggerGapTool.execute;
export default archiveRetentionTriggerGapTool;
