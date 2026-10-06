import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly datasetId: string;
  readonly sourceId: string;
  readonly permissionPurpose: string;
  readonly permissionRecorded: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    datasetId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
    permissionPurpose: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecorded: { type: "boolean" },
  },
  required: [
    "datasetId",
    "sourceId",
    "permissionPurpose",
    "permissionRecorded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit farm-data source and purpose-specific permission metadata without deciding legal authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { datasetId, sourceId, permissionPurpose, permissionRecorded } =
    request;
  const compute = (): Output => {
    H.domain(
      datasetId.length > 0 &&
        sourceId.length > 0 &&
        permissionPurpose.length > 0,
      "datasetId",
    );
    return {
      token: JSON.stringify([
        datasetId,
        sourceId,
        permissionPurpose,
        permissionRecorded,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    datasetId: "DATA17",
    sourceId: "SRC2",
    permissionPurpose: "analysis",
    permissionRecorded: true,
  },
  output: { token: '["DATA17","SRC2","analysis",true]' },
} satisfies ToolExample<Input, Output>;
export const farmDataSourcePermissionTagTool = H.defineSchemaCalculation<
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
    id: "agroinformatics/farm-data-source-permission-tag",
    title: "Farm Data Source Permission Tag",
    description:
      "Record explicit farm-data source and purpose-specific permission metadata without deciding legal authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        datasetId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
        permissionPurpose: { type: "string", maxLength: 8192, minLength: 1 },
        permissionRecorded: { type: "boolean" },
      },
      required: [
        "datasetId",
        "sourceId",
        "permissionPurpose",
        "permissionRecorded",
      ],
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
          id: "datasetId",
          label: "Dataset Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permissionPurpose",
          label: "Permission Purpose",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permissionRecorded",
          label: "Permission Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = farmDataSourcePermissionTagTool.execute;
export default farmDataSourcePermissionTagTool;
