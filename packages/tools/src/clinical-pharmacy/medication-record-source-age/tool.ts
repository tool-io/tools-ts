import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordDay: number;
  readonly sourceDay: number;
  readonly source: string;
  readonly version: string;
};
export type Output = { readonly ageDays: number; readonly sourceKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordDay: { type: "integer" },
    sourceDay: { type: "integer" },
    source: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
  },
  required: ["recordDay", "sourceDay", "source", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageDays: { type: "integer" },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["ageDays", "sourceKey"],
} as const;
/** Inspect supplied medication-record source/version vintage without evaluating therapy or record validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordDay, sourceDay, source, version } = request;
  const compute = (): Output => {
    return {
      ageDays: recordDay - sourceDay,
      sourceKey: JSON.stringify([source, version]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordDay: 130, sourceDay: 100, source: "system-A", version: "v2" },
  output: { ageDays: 30, sourceKey: '["system-A","v2"]' },
} satisfies ToolExample<Input, Output>;
export const medicationRecordSourceAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/medication-record-source-age",
    title: "Medication Record Source Age Tool",
    description:
      "Inspect supplied medication-record source/version vintage without evaluating therapy or record validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordDay: { type: "integer" },
        sourceDay: { type: "integer" },
        source: { type: "string", maxLength: 8192 },
        version: { type: "string", maxLength: 8192 },
      },
      required: ["recordDay", "sourceDay", "source", "version"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageDays: { type: "integer" },
        sourceKey: { type: "string", maxLength: 8192 },
      },
      required: ["ageDays", "sourceKey"],
    },
    ports: {
      inputs: [
        {
          id: "recordDay",
          label: "Record Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceDay",
          label: "Source Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "version",
          label: "Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = medicationRecordSourceAgeTool.execute;
export default medicationRecordSourceAgeTool;
