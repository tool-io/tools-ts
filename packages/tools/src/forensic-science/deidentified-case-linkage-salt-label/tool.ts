import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseNamespace: string;
  readonly suppliedSaltVersion: string;
  readonly linkageProcedureId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseNamespace: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSaltVersion: { type: "string", maxLength: 8192, minLength: 1 },
    linkageProcedureId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["caseNamespace", "suppliedSaltVersion", "linkageProcedureId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record supplied case-linkage namespace and salt-version metadata without creating hashes, storing secrets or claiming anonymization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseNamespace, suppliedSaltVersion, linkageProcedureId } = request;
  const compute = (): Output => {
    H.domain(caseNamespace.length > 0, "caseNamespace");
    H.domain(suppliedSaltVersion.length > 0, "suppliedSaltVersion");
    H.domain(linkageProcedureId.length > 0, "linkageProcedureId");
    return {
      token: JSON.stringify([
        caseNamespace,
        suppliedSaltVersion,
        linkageProcedureId,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    caseNamespace: "N17",
    suppliedSaltVersion: "v2",
    linkageProcedureId: "P4",
  },
  output: { token: '["N17","v2","P4"]' },
} satisfies ToolExample<Input, Output>;
export const deidentifiedCaseLinkageSaltLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "forensic-science/deidentified-case-linkage-salt-label",
    title: "Deidentified Case Linkage Salt Label Tool",
    description:
      "Record supplied case-linkage namespace and salt-version metadata without creating hashes, storing secrets or claiming anonymization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseNamespace: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSaltVersion: { type: "string", maxLength: 8192, minLength: 1 },
        linkageProcedureId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["caseNamespace", "suppliedSaltVersion", "linkageProcedureId"],
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
          id: "caseNamespace",
          label: "Case Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSaltVersion",
          label: "Supplied Salt Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "linkageProcedureId",
          label: "Linkage Procedure Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = deidentifiedCaseLinkageSaltLabelTool.execute;
export default deidentifiedCaseLinkageSaltLabelTool;
