import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly createdTime: number;
  readonly retention: number;
  readonly queryTime: number;
  readonly legalHold: boolean;
};
export type Output = {
  readonly expiryTime: number;
  readonly slack: number;
  readonly expiryBlocked: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    createdTime: { type: "number" },
    retention: { type: "number", minimum: 0 },
    queryTime: { type: "number" },
    legalHold: { type: "boolean" },
  },
  required: ["createdTime", "retention", "queryTime", "legalHold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expiryTime: { type: "number" },
    slack: { type: "number" },
    expiryBlocked: { type: "boolean" },
  },
  required: ["expiryTime", "slack", "expiryBlocked"],
} as const;
/** Supplied retention-clock bookkeeping with a separate hold flag; no backup deletion occurs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { createdTime, retention, queryTime, legalHold } = request;
  const compute = (): Output => {
    H.domain(retention >= 0);
    return {
      expiryTime: createdTime + retention,
      slack: createdTime + retention - queryTime,
      expiryBlocked: legalHold,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { createdTime: 100, retention: 30, queryTime: 120, legalHold: false },
  output: { expiryTime: 130, slack: 10, expiryBlocked: false },
} satisfies ToolExample<Input, Output>;
export const backupSnapshotExpirySlackTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/backup-snapshot-expiry-slack",
    title: "Backup Snapshot Expiry Slack Tool",
    description:
      "Supplied retention-clock bookkeeping with a separate hold flag; no backup deletion occurs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        createdTime: { type: "number" },
        retention: { type: "number", minimum: 0 },
        queryTime: { type: "number" },
        legalHold: { type: "boolean" },
      },
      required: ["createdTime", "retention", "queryTime", "legalHold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expiryTime: { type: "number" },
        slack: { type: "number" },
        expiryBlocked: { type: "boolean" },
      },
      required: ["expiryTime", "slack", "expiryBlocked"],
    },
    ports: {
      inputs: [
        {
          id: "createdTime",
          label: "Created Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "retention",
          label: "Retention",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "queryTime",
          label: "Query Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "legalHold",
          label: "Legal Hold",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "expiryTime",
          label: "Expiry Time",
          valueType: { type: "number" },
        },
        { id: "slack", label: "Slack", valueType: { type: "number" } },
        {
          id: "expiryBlocked",
          label: "Expiry Blocked",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = backupSnapshotExpirySlackTool.execute;
export default backupSnapshotExpirySlackTool;
