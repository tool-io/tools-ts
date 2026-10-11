import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleId: string;
  readonly originRecordId: string;
  readonly permissionPurpose: string;
  readonly permissionRecorded: boolean;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    originRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    permissionPurpose: { type: "string", maxLength: 8192, minLength: 1 },
    permissionRecorded: { type: "boolean" },
  },
  required: [
    "sampleId",
    "originRecordId",
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
/** Record explicit sample-origin and permission metadata without determining legal authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, originRecordId, permissionPurpose, permissionRecorded } =
    request;
  const compute = (): Output => {
    H.domain(
      sampleId.length > 0 &&
        originRecordId.length > 0 &&
        permissionPurpose.length > 0,
      "sampleId",
    );
    return {
      token: JSON.stringify([
        sampleId,
        originRecordId,
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
    sampleId: "S17",
    originRecordId: "ORG2",
    permissionPurpose: "analysis",
    permissionRecorded: true,
  },
  output: { token: '["S17","ORG2","analysis",true]' },
} satisfies ToolExample<Input, Output>;
export const botanicalsampleOriginPermissionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacognosy", "pharmacy"],
      keywords: ["pharmacognosy", "pharmacy"],
    },
    id: "pharmacognosy/botanical-sample-origin-permission",
    title: "Botanical Sample Origin Permission",
    description:
      "Record explicit sample-origin and permission metadata without determining legal authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        originRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        permissionPurpose: { type: "string", maxLength: 8192, minLength: 1 },
        permissionRecorded: { type: "boolean" },
      },
      required: [
        "sampleId",
        "originRecordId",
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originRecordId",
          label: "Origin Record Id",
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
export const run = botanicalsampleOriginPermissionTool.execute;
export default botanicalsampleOriginPermissionTool;
