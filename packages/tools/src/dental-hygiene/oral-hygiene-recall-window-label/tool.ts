import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recordId: string; readonly recallDays: number };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    recallDays: { type: "integer", minimum: 1 },
  },
  required: ["recordId", "recallDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied oral-hygiene recall duration without interpreting a self-report. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, recallDays } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    (H.domain(
      Number.isSafeInteger(recallDays) &&
        recallDays >= 1 &&
        recallDays <= Number.MAX_SAFE_INTEGER,
      "recallDays",
    ),
      recallDays);
    return {
      label: recordId + "; oral-hygiene recall=" + recallDays + " days",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", recallDays: 7 },
  output: { label: "R17; oral-hygiene recall=7 days" },
} satisfies ToolExample<Input, Output>;
export const oralHygieneRecallWindowLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
      keywords: ["dental hygiene", "health and medicine"],
    },
    id: "dental-hygiene/oral-hygiene-recall-window-label",
    title: "Oral Hygiene Recall Window Label",
    description:
      "Label an explicitly supplied oral-hygiene recall duration without interpreting a self-report.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        recallDays: { type: "integer", minimum: 1 },
      },
      required: ["recordId", "recallDays"],
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
          id: "recallDays",
          label: "Recall Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = oralHygieneRecallWindowLabelTool.execute;
export default oralHygieneRecallWindowLabelTool;
