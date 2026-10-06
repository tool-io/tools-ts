import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldId: string;
  readonly parentFieldId: string;
  readonly splitRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldId: { type: "string", maxLength: 8192, minLength: 1 },
    parentFieldId: { type: "string", maxLength: 8192, minLength: 1 },
    splitRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["fieldId", "parentFieldId", "splitRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit field-parent split reference without altering boundaries. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldId, parentFieldId, splitRecordId } = request;
  const compute = (): Output => {
    H.domain(fieldId.length > 0, "fieldId");
    H.domain(parentFieldId.length > 0, "parentFieldId");
    H.domain(splitRecordId.length > 0, "splitRecordId");
    return { token: JSON.stringify([fieldId, parentFieldId, splitRecordId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldId: "F17", parentFieldId: "PARENT2", splitRecordId: "SPLIT2" },
  output: { token: '["F17","PARENT2","SPLIT2"]' },
} satisfies ToolExample<Input, Output>;
export const fieldIdSplitParentReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroinformatics", "agriculture"],
      keywords: ["agroinformatics", "agriculture"],
    },
    id: "agroinformatics/field-id-split-parent-reference",
    title: "Field ID Split Parent Reference",
    description:
      "Qualify an explicit field-parent split reference without altering boundaries.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldId: { type: "string", maxLength: 8192, minLength: 1 },
        parentFieldId: { type: "string", maxLength: 8192, minLength: 1 },
        splitRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["fieldId", "parentFieldId", "splitRecordId"],
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
          id: "fieldId",
          label: "Field Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "parentFieldId",
          label: "Parent Field Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "splitRecordId",
          label: "Split Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fieldIdSplitParentReferenceTool.execute;
export default fieldIdSplitParentReferenceTool;
