import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTimestampSeconds: number;
  readonly entryTimestampSeconds: number;
  readonly allowedLagSeconds: number;
};
export type Output = {
  readonly entryLagSeconds: number;
  readonly beyondSuppliedLag: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTimestampSeconds: { type: "number" },
    entryTimestampSeconds: { type: "number" },
    allowedLagSeconds: { type: "number", minimum: 0 },
  },
  required: [
    "eventTimestampSeconds",
    "entryTimestampSeconds",
    "allowedLagSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryLagSeconds: { type: "number" },
    beyondSuppliedLag: { type: "boolean" },
  },
  required: ["entryLagSeconds", "beyondSuppliedLag"],
} as const;
/** Compare a record entry’s signed event-time lag with an explicit inclusive documentation allowance without judging clinical conduct. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTimestampSeconds, entryTimestampSeconds, allowedLagSeconds } =
    request;
  const compute = (): Output => {
    H.domain(allowedLagSeconds >= 0, "allowedLagSeconds");
    return {
      entryLagSeconds: entryTimestampSeconds - eventTimestampSeconds,
      beyondSuppliedLag:
        entryTimestampSeconds - eventTimestampSeconds > allowedLagSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventTimestampSeconds: 1000,
    entryTimestampSeconds: 1600,
    allowedLagSeconds: 300,
  },
  output: { entryLagSeconds: 600, beyondSuppliedLag: true },
} satisfies ToolExample<Input, Output>;
export const emergencyRecordRetrospectiveEntryFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "emergency-medicine",
          "emergency medicine",
          "health and medicine",
        ],
        keywords: ["emergency medicine", "health and medicine"],
      },
      id: "emergency-medicine/emergency-record-retrospective-entry-flag",
      title: "Emergency Record Retrospective Entry Flag",
      description:
        "Compare a record entry’s signed event-time lag with an explicit inclusive documentation allowance without judging clinical conduct.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eventTimestampSeconds: { type: "number" },
          entryTimestampSeconds: { type: "number" },
          allowedLagSeconds: { type: "number", minimum: 0 },
        },
        required: [
          "eventTimestampSeconds",
          "entryTimestampSeconds",
          "allowedLagSeconds",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entryLagSeconds: { type: "number" },
          beyondSuppliedLag: { type: "boolean" },
        },
        required: ["entryLagSeconds", "beyondSuppliedLag"],
      },
      ports: {
        inputs: [
          {
            id: "eventTimestampSeconds",
            label: "Event Timestamp Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "entryTimestampSeconds",
            label: "Entry Timestamp Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "allowedLagSeconds",
            label: "Allowed Lag Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "entryLagSeconds",
            label: "Entry Lag Seconds",
            valueType: { type: "number" },
          },
          {
            id: "beyondSuppliedLag",
            label: "Beyond Supplied Lag",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = emergencyRecordRetrospectiveEntryFlagTool.execute;
export default emergencyRecordRetrospectiveEntryFlagTool;
