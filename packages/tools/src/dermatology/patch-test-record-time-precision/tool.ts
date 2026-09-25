import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTime: number;
  readonly beforeWidth: number;
  readonly afterWidth: number;
};
export type Output = { readonly earliest: number; readonly latest: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTime: { type: "number" },
    beforeWidth: { type: "number", minimum: 0 },
    afterWidth: { type: "number", minimum: 0 },
  },
  required: ["recordedTime", "beforeWidth", "afterWidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { earliest: { type: "number" }, latest: { type: "number" } },
  required: ["earliest", "latest"],
} as const;
/** Keep a supplied research-record timestamp envelope without selecting a test-reading schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTime, beforeWidth, afterWidth } = request;
  const compute = (): Output => {
    H.domain(beforeWidth >= 0 && afterWidth >= 0);
    return {
      earliest: recordedTime - beforeWidth,
      latest: recordedTime + afterWidth,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedTime: 100, beforeWidth: 5, afterWidth: 10 },
  output: { earliest: 95, latest: 110 },
} satisfies ToolExample<Input, Output>;
export const patchTestRecordTimePrecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dermatology/patch-test-record-time-precision",
    title: "Patch Test Record Time Precision Tool",
    description:
      "Keep a supplied research-record timestamp envelope without selecting a test-reading schedule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTime: { type: "number" },
        beforeWidth: { type: "number", minimum: 0 },
        afterWidth: { type: "number", minimum: 0 },
      },
      required: ["recordedTime", "beforeWidth", "afterWidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { earliest: { type: "number" }, latest: { type: "number" } },
      required: ["earliest", "latest"],
    },
    ports: {
      inputs: [
        {
          id: "recordedTime",
          label: "Recorded Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "beforeWidth",
          label: "Before Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterWidth",
          label: "After Width",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "earliest", label: "Earliest", valueType: { type: "number" } },
        { id: "latest", label: "Latest", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = patchTestRecordTimePrecisionTool.execute;
export default patchTestRecordTimePrecisionTool;
