import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedPermissionStatus: string;
  readonly permissionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPermissionStatus: { type: "string", maxLength: 8192, minLength: 1 },
    permissionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedPermissionStatus", "permissionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit archive publication-permission metadata without granting rights or interpreting access rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedPermissionStatus, permissionSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedPermissionStatus.length > 0, "suppliedPermissionStatus");
    H.domain(permissionSource.length > 0, "permissionSource");
    return {
      token: JSON.stringify([
        recordId,
        suppliedPermissionStatus,
        permissionSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedPermissionStatus: "permitted excerpt",
    permissionSource: "P4",
  },
  output: { token: '["R17","permitted excerpt","P4"]' },
} satisfies ToolExample<Input, Output>;
export const islamicArchivePublicationPermissionTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "islamic-studies/islamic-archive-publication-permission-tag",
      title: "Islamic Archive Publication Permission Tag Tool",
      description:
        "Preserve explicit archive publication-permission metadata without granting rights or interpreting access rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPermissionStatus: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          permissionSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedPermissionStatus", "permissionSource"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedPermissionStatus",
            label: "Supplied Permission Status",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permissionSource",
            label: "Permission Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = islamicArchivePublicationPermissionTagTool.execute;
export default islamicArchivePublicationPermissionTagTool;
