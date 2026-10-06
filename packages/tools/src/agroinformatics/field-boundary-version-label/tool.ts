import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldId: string;
  readonly boundaryRecordId: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldId: { type: "string", maxLength: 8192, minLength: 1 },
    boundaryRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["fieldId", "boundaryRecordId", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit field-boundary reference by version without editing geometry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldId, boundaryRecordId, version } = request;
  const compute = (): Output => {
    H.domain(fieldId.length > 0, "fieldId");
    H.domain(boundaryRecordId.length > 0, "boundaryRecordId");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([fieldId, boundaryRecordId, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fieldId: "F17", boundaryRecordId: "BOUND2", version: "v2" },
  output: { token: '["F17","BOUND2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const fieldBoundaryVersionLabelTool = H.defineSchemaCalculation<
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
    id: "agroinformatics/field-boundary-version-label",
    title: "Field Boundary Version Label",
    description:
      "Qualify an explicit field-boundary reference by version without editing geometry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldId: { type: "string", maxLength: 8192, minLength: 1 },
        boundaryRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["fieldId", "boundaryRecordId", "version"],
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
          id: "boundaryRecordId",
          label: "Boundary Record Id",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fieldBoundaryVersionLabelTool.execute;
export default fieldBoundaryVersionLabelTool;
