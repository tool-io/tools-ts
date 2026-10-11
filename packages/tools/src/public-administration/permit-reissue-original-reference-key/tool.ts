import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly permitId: string;
  readonly originalPermitId: string;
  readonly reissueVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    permitId: { type: "string", maxLength: 8192, minLength: 1 },
    originalPermitId: { type: "string", maxLength: 8192, minLength: 1 },
    reissueVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["permitId", "originalPermitId", "reissueVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit permit reissue by original reference without determining permit validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { permitId, originalPermitId, reissueVersion } = request;
  const compute = (): Output => {
    H.domain(permitId.length > 0, "permitId");
    H.domain(originalPermitId.length > 0, "originalPermitId");
    H.domain(reissueVersion.length > 0, "reissueVersion");
    return {
      token: JSON.stringify([permitId, originalPermitId, reissueVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { permitId: "PER17", originalPermitId: "ORIG2", reissueVersion: "v2" },
  output: { token: '["PER17","ORIG2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const permitReissueOriginalReferenceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "public-administration",
        "public administration",
        "social sciences",
      ],
      keywords: ["public administration", "social sciences"],
    },
    id: "public-administration/permit-reissue-original-reference-key",
    title: "Permit Reissue Original Reference Key",
    description:
      "Qualify an explicit permit reissue by original reference without determining permit validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        permitId: { type: "string", maxLength: 8192, minLength: 1 },
        originalPermitId: { type: "string", maxLength: 8192, minLength: 1 },
        reissueVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["permitId", "originalPermitId", "reissueVersion"],
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
          id: "permitId",
          label: "Permit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "originalPermitId",
          label: "Original Permit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reissueVersion",
          label: "Reissue Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = permitReissueOriginalReferenceKeyTool.execute;
export default permitReissueOriginalReferenceKeyTool;
