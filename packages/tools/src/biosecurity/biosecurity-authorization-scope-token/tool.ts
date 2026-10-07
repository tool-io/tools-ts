import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorizationRecordId: string;
  readonly scopeCode: string;
  readonly version: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorizationRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    scopeCode: { type: "string", maxLength: 8192, minLength: 1 },
    version: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["authorizationRecordId", "scopeCode", "version"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit authorization-scope reference by version without evaluating or granting authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorizationRecordId, scopeCode, version } = request;
  const compute = (): Output => {
    H.domain(authorizationRecordId.length > 0, "authorizationRecordId");
    H.domain(scopeCode.length > 0, "scopeCode");
    H.domain(version.length > 0, "version");
    return {
      token: JSON.stringify([authorizationRecordId, scopeCode, version]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    authorizationRecordId: "AUTH17",
    scopeCode: "SCOPE2",
    version: "v2",
  },
  output: { token: '["AUTH17","SCOPE2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const biosecurityAuthorizationScopeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosecurity", "research and quality management"],
      keywords: ["biosecurity", "research and quality management"],
    },
    id: "biosecurity/biosecurity-authorization-scope-token",
    title: "Biosecurity Authorization Scope Token",
    description:
      "Qualify an explicit authorization-scope reference by version without evaluating or granting authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorizationRecordId: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        scopeCode: { type: "string", maxLength: 8192, minLength: 1 },
        version: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["authorizationRecordId", "scopeCode", "version"],
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
          id: "authorizationRecordId",
          label: "Authorization Record Id",
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
export const run = biosecurityAuthorizationScopeTokenTool.execute;
export default biosecurityAuthorizationScopeTokenTool;
