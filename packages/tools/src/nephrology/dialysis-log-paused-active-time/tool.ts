import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startMinutes: number;
  readonly endMinutes: number;
  readonly recordedPauses: readonly number[];
  readonly overlapCorrection: number;
};
export type Output = {
  readonly grossMinutes: number;
  readonly pauseUnionMinutes: number;
  readonly activeMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startMinutes: { type: "number" },
    endMinutes: { type: "number" },
    recordedPauses: { type: "array", maxItems: 256, items: { type: "number" } },
    overlapCorrection: { type: "number", minimum: 0 },
  },
  required: [
    "startMinutes",
    "endMinutes",
    "recordedPauses",
    "overlapCorrection",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossMinutes: { type: "number" },
    pauseUnionMinutes: { type: "number" },
    activeMinutes: { type: "number" },
  },
  required: ["grossMinutes", "pauseUnionMinutes", "activeMinutes"],
} as const;
/** Recorded session-time accounting from explicit pause durations and their supplied overlap correction, without treatment-duration recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startMinutes, endMinutes, recordedPauses, overlapCorrection } =
    request;
  const compute = (): Output => {
    H.domain(
      endMinutes >= startMinutes &&
        recordedPauses.every((x) => x >= 0) &&
        overlapCorrection >= 0 &&
        overlapCorrection <= recordedPauses.reduce((a, b) => a + b, 0) &&
        recordedPauses.reduce((a, b) => a + b, 0) - overlapCorrection <=
          endMinutes - startMinutes,
    );
    return {
      grossMinutes: endMinutes - startMinutes,
      pauseUnionMinutes:
        recordedPauses.reduce((a, b) => a + b, 0) - overlapCorrection,
      activeMinutes:
        endMinutes -
        startMinutes -
        recordedPauses.reduce((a, b) => a + b, 0) +
        overlapCorrection,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startMinutes: 0,
    endMinutes: 240,
    recordedPauses: [10, 20],
    overlapCorrection: 5,
  },
  output: { grossMinutes: 240, pauseUnionMinutes: 25, activeMinutes: 215 },
} satisfies ToolExample<Input, Output>;
export const dialysisLogPausedActiveTimeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/dialysis-log-paused-active-time",
    title: "Dialysis Log Paused Active Time Tool",
    description:
      "Recorded session-time accounting from explicit pause durations and their supplied overlap correction, without treatment-duration recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startMinutes: { type: "number" },
        endMinutes: { type: "number" },
        recordedPauses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        overlapCorrection: { type: "number", minimum: 0 },
      },
      required: [
        "startMinutes",
        "endMinutes",
        "recordedPauses",
        "overlapCorrection",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossMinutes: { type: "number" },
        pauseUnionMinutes: { type: "number" },
        activeMinutes: { type: "number" },
      },
      required: ["grossMinutes", "pauseUnionMinutes", "activeMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "startMinutes",
          label: "Start Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "endMinutes",
          label: "End Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "recordedPauses",
          label: "Recorded Pauses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "overlapCorrection",
          label: "Overlap Correction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossMinutes",
          label: "Gross Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "pauseUnionMinutes",
          label: "Pause Union Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "activeMinutes",
          label: "Active Minutes",
          valueType: { type: "number", unit: "min" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialysisLogPausedActiveTimeTool.execute;
export default dialysisLogPausedActiveTimeTool;
