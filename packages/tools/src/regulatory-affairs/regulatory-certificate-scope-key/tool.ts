import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly certificateId: string;
  readonly scopeCode: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    certificateId: { type: "string", maxLength: 8192, minLength: 1 },
    scopeCode: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["certificateId", "scopeCode", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit certificate scope identifier by version without authenticating certification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { certificateId, scopeCode, version } = request;
  const compute = (): Output => {
    H.domain(certificateId.length > 0, "certificateId");
    H.domain(scopeCode.length > 0, "scopeCode");
    H.domain(version.length > 0, "version");
    return { token: JSON.stringify([certificateId, scopeCode, version]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { certificateId: "CERT17", scopeCode: "SCOPE2", version: "v2" },
  output: { token: '["CERT17","SCOPE2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const regulatoryCertificateScopeKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "regulatory-affairs",
        "regulatory affairs",
        "research and quality management",
      ],
      keywords: ["regulatory affairs", "research and quality management"],
    },
    id: "regulatory-affairs/regulatory-certificate-scope-key",
    title: "Regulatory Certificate Scope Key",
    description:
      "Qualify an explicit certificate scope identifier by version without authenticating certification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        certificateId: { type: "string", maxLength: 8192, minLength: 1 },
        scopeCode: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["certificateId", "scopeCode", "version"],
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
          id: "certificateId",
          label: "Certificate Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "scopeCode",
          label: "Scope Code",
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
export const run = regulatoryCertificateScopeKeyTool.execute;
export default regulatoryCertificateScopeKeyTool;
