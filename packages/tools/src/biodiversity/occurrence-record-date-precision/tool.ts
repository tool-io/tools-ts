import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly occurrenceId: string;
  readonly dateText: string;
  readonly suppliedPrecision: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["occurrenceId", "dateText", "suppliedPrecision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied occurrence date transcription and precision without inventing missing date fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { occurrenceId, dateText, suppliedPrecision } = request;
  const compute = (): Output => {
    H.domain(occurrenceId.length > 0, "occurrenceId");
    H.domain(dateText.length > 0, "dateText");
    H.domain(suppliedPrecision.length > 0, "suppliedPrecision");
    return {
      token: JSON.stringify([occurrenceId, dateText, suppliedPrecision]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    occurrenceId: "O17",
    dateText: "2026-10",
    suppliedPrecision: "month",
  },
  output: { token: '["O17","2026-10","month"]' },
} satisfies ToolExample<Input, Output>;
export const occurrenceRecordDateprecisionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/occurrence-record-date-precision",
    title: "Occurrence Record Date Precision",
    description:
      "Preserve a supplied occurrence date transcription and precision without inventing missing date fields.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occurrenceId: { type: "string", maxLength: 8192, minLength: 1 },
        dateText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["occurrenceId", "dateText", "suppliedPrecision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "occurrenceId",
          label: "Occurrence Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "dateText",
          label: "Date Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedPrecision",
          label: "Supplied Precision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = occurrenceRecordDateprecisionTool.execute;
export default occurrenceRecordDateprecisionTool;
