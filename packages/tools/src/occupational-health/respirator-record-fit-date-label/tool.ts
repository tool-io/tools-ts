import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly recordedFitDate: string;
  readonly source: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedFitDate: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "recordedFitDate", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicit respirator fit-record date without determining fit validity or required retesting. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, recordedFitDate, source } = request;
  const compute = (): Output => {
    const namedDate = (value: string, field: string): Date => {
      H.domain(/^\d{4}-\d{2}-\d{2}(?![\s\S])/.test(value), field);
      const date = new Date(value + "T00:00:00Z");
      H.domain(
        Number.isFinite(date.getTime()) &&
          date.toISOString().slice(0, 10) === value,
        field,
      );
      return date;
    };
    H.domain(recordId.length > 0 && source.length > 0, "recordId");
    namedDate(recordedFitDate, "recordedFitDate");
    return {
      label: recordId + "; fit record=" + recordedFitDate + " [" + source + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    recordedFitDate: "2026-10-01",
    source: "Training record",
  },
  output: { label: "R17; fit record=2026-10-01 [Training record]" },
} satisfies ToolExample<Input, Output>;
export const respiratorRecordFitDateLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-health",
        "occupational health",
        "health and medicine",
      ],
      keywords: ["occupational health", "health and medicine"],
    },
    id: "occupational-health/respirator-record-fit-date-label",
    title: "Respirator Record Fit Date Label",
    description:
      "Label an explicit respirator fit-record date without determining fit validity or required retesting.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedFitDate: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "recordedFitDate", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedFitDate",
          label: "Recorded Fit Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = respiratorRecordFitDateLabelTool.execute;
export default respiratorRecordFitDateLabelTool;
