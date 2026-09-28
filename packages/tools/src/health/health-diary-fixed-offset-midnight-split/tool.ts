import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startLocalMinute: number;
  readonly durationMinutes: number;
};
export type Output = { readonly segments: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startLocalMinute: { type: "integer", minimum: 0, maximum: 1439 },
    durationMinutes: { type: "integer", minimum: 0, maximum: 366000 },
  },
  required: ["startLocalMinute", "durationMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segments: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["segments"],
} as const;
/** Calculate health diary fixed offset midnight split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startLocalMinute, durationMinutes } = request;
  const compute = (): Output => {
    H.integer(startLocalMinute, 0, 1439);
    H.integer(durationMinutes, 0, 366000);
    const segments: number[] = [];
    let remaining = durationMinutes,
      room = 1440 - startLocalMinute;
    while (remaining > 0) {
      const n = Math.min(room, remaining);
      segments.push(n);
      remaining -= n;
      room = 1440;
    }
    return { segments };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { startLocalMinute: 1380, durationMinutes: 180 },
  output: { segments: [60, 120] },
} satisfies ToolExample<Input, Output>;
export const healthDiaryFixedOffsetMidnightSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health/health-diary-fixed-offset-midnight-split",
      title: "Health Diary Fixed Offset Midnight Split Tool",
      description:
        "Calculate health diary fixed offset midnight split from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          startLocalMinute: { type: "integer", minimum: 0, maximum: 1439 },
          durationMinutes: { type: "integer", minimum: 0, maximum: 366000 },
        },
        required: ["startLocalMinute", "durationMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          segments: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: ["segments"],
      },
      ports: {
        inputs: [
          {
            id: "startLocalMinute",
            label: "Start Local Minute",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "durationMinutes",
            label: "Duration Minutes",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "segments",
            label: "Segments",
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthDiaryFixedOffsetMidnightSplitTool.execute;
export default healthDiaryFixedOffsetMidnightSplitTool;
