import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedAccessCode: string;
  readonly permissionSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAccessCode: { type: "string", maxLength: 8192, minLength: 1 },
    permissionSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedAccessCode", "permissionSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit song-record access metadata and permission source without disclosing content or assigning cultural authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedAccessCode, permissionSource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedAccessCode.length > 0, "suppliedAccessCode");
    H.domain(permissionSource.length > 0, "permissionSource");
    return {
      token: JSON.stringify([recordId, suppliedAccessCode, permissionSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedAccessCode: "public excerpt",
    permissionSource: "P4",
  },
  output: { token: '["R17","public excerpt","P4"]' },
} satisfies ToolExample<Input, Output>;
export const songlinePublicAccessLicenseTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/songline-public-access-license-tag",
    title: "Songline Public Access License Tag Tool",
    description:
      "Preserve explicit song-record access metadata and permission source without disclosing content or assigning cultural authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAccessCode: { type: "string", maxLength: 8192, minLength: 1 },
        permissionSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedAccessCode", "permissionSource"],
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
          id: "suppliedAccessCode",
          label: "Supplied Access Code",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = songlinePublicAccessLicenseTagTool.execute;
export default songlinePublicAccessLicenseTagTool;
