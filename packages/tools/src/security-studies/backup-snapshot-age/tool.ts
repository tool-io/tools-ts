import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly snapshotTimestampSeconds: number;
  readonly asOfTimestampSeconds: number;
};
export type Output = { readonly ageSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    snapshotTimestampSeconds: { type: "number" },
    asOfTimestampSeconds: { type: "number" },
  },
  required: ["snapshotTimestampSeconds", "asOfTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ageSeconds: { type: "number" } },
  required: ["ageSeconds"],
} as const;
/** Measure an existing backup snapshot's age on an explicit shared timestamp scale without accessing or changing backups. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { snapshotTimestampSeconds, asOfTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      asOfTimestampSeconds >= snapshotTimestampSeconds,
      "asOfTimestampSeconds",
    );
    return { ageSeconds: asOfTimestampSeconds - snapshotTimestampSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { snapshotTimestampSeconds: 1000, asOfTimestampSeconds: 4600 },
  output: { ageSeconds: 3600 },
} satisfies ToolExample<Input, Output>;
export const backupSnapshotAgeTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "security-studies/backup-snapshot-age",
    title: "Backup Snapshot Age Tool",
    description:
      "Measure an existing backup snapshot's age on an explicit shared timestamp scale without accessing or changing backups.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        snapshotTimestampSeconds: { type: "number" },
        asOfTimestampSeconds: { type: "number" },
      },
      required: ["snapshotTimestampSeconds", "asOfTimestampSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ageSeconds: { type: "number" } },
      required: ["ageSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "snapshotTimestampSeconds",
          label: "Snapshot Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "asOfTimestampSeconds",
          label: "As Of Timestamp Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ageSeconds",
          label: "Age Seconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = backupSnapshotAgeTool.execute;
export default backupSnapshotAgeTool;
