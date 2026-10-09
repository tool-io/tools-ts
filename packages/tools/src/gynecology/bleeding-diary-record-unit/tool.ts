import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly reportedValue: number;
  readonly unitWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    reportedValue: { type: "number", minimum: 0 },
    unitWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["entryId", "reportedValue", "unitWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported bleeding-diary quantity without estimating blood loss or clinical severity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, reportedValue, unitWording } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0 && unitWording.length > 0, "entryId");
    H.domain(reportedValue >= 0, "reportedValue");
    return { label: entryId + "; " + reportedValue + " " + unitWording };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryId: "D17", reportedValue: 3, unitWording: "recorded items" },
  output: { label: "D17; 3 recorded items" },
} satisfies ToolExample<Input, Output>;
export const bleedingDiaryRecordUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["gynecology", "health and medicine"],
      keywords: ["gynecology", "health and medicine"],
    },
    id: "gynecology/bleeding-diary-record-unit",
    title: "Bleeding Diary Record Unit",
    description:
      "Label an explicitly reported bleeding-diary quantity without estimating blood loss or clinical severity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryId: { type: "string", maxLength: 8192, minLength: 1 },
        reportedValue: { type: "number", minimum: 0 },
        unitWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["entryId", "reportedValue", "unitWording"],
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
          id: "entryId",
          label: "Entry Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reportedValue",
          label: "Reported Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitWording",
          label: "Unit Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = bleedingDiaryRecordUnitTool.execute;
export default bleedingDiaryRecordUnitTool;
