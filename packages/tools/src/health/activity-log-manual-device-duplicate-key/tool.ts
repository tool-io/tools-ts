import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly date: string;
  readonly activity: string;
  readonly startMinute: number;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    date: { type: "string", maxLength: 8192 },
    activity: { type: "string", maxLength: 8192 },
    startMinute: { type: "integer", minimum: 0, maximum: 1439 },
  },
  required: ["date", "activity", "startMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Calculate activity log manual device duplicate key from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { date, activity, startMinute } = request;
  const compute = (): Output => {
    H.dateOnly(date);
    H.integer(startMinute, 0, 1439);
    return { key: JSON.stringify([date, activity, startMinute]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { date: "2026-10-26", activity: "walk", startMinute: 480 },
  output: { key: '["2026-10-26","walk",480]' },
} satisfies ToolExample<Input, Output>;
export const activityLogManualDeviceDuplicateKeyTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/activity-log-manual-device-duplicate-key",
      title: "Activity Log Manual Device Duplicate Key Tool",
      description:
        "Calculate activity log manual device duplicate key from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          date: { type: "string", maxLength: 8192 },
          activity: { type: "string", maxLength: 8192 },
          startMinute: { type: "integer", minimum: 0, maximum: 1439 },
        },
        required: ["date", "activity", "startMinute"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { key: { type: "string", maxLength: 8192 } },
        required: ["key"],
      },
      ports: {
        inputs: [
          {
            id: "date",
            label: "Date",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "activity",
            label: "Activity",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "startMinute",
            label: "Start Minute",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
      },
    },
    calculate,
  });
export const run = activityLogManualDeviceDuplicateKeyTool.execute;
export default activityLogManualDeviceDuplicateKeyTool;
