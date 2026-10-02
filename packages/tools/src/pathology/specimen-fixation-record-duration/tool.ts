import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedStart: number;
  readonly recordedEnd: number;
  readonly suppliedPause: number;
};
export type Output = {
  readonly elapsed: number;
  readonly countedDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedStart: { type: "number" },
    recordedEnd: { type: "number" },
    suppliedPause: { type: "number", minimum: 0 },
  },
  required: ["recordedStart", "recordedEnd", "suppliedPause"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    countedDuration: { type: "number" },
  },
  required: ["elapsed", "countedDuration"],
} as const;
/** Supplied specimen-record timing only; no fixation duration, procedure or diagnostic guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedStart, recordedEnd, suppliedPause } = request;
  const compute = (): Output => {
    H.domain(
      recordedEnd >= recordedStart &&
        suppliedPause >= 0 &&
        suppliedPause <= recordedEnd - recordedStart,
    );
    return {
      elapsed: recordedEnd - recordedStart,
      countedDuration: recordedEnd - recordedStart - suppliedPause,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedStart: 10, recordedEnd: 50, suppliedPause: 5 },
  output: { elapsed: 40, countedDuration: 35 },
} satisfies ToolExample<Input, Output>;
export const specimenFixationRecordDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pathology/specimen-fixation-record-duration",
    title: "Specimen Fixation Record Duration Tool",
    description:
      "Supplied specimen-record timing only; no fixation duration, procedure or diagnostic guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedStart: { type: "number" },
        recordedEnd: { type: "number" },
        suppliedPause: { type: "number", minimum: 0 },
      },
      required: ["recordedStart", "recordedEnd", "suppliedPause"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        countedDuration: { type: "number" },
      },
      required: ["elapsed", "countedDuration"],
    },
    ports: {
      inputs: [
        {
          id: "recordedStart",
          label: "Recorded Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recordedEnd",
          label: "Recorded End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPause",
          label: "Supplied Pause",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "countedDuration",
          label: "Counted Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = specimenFixationRecordDurationTool.execute;
export default specimenFixationRecordDurationTool;
