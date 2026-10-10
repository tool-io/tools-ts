import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly communityNamespace: string;
  readonly suppliedFieldCode: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    communityNamespace: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedFieldCode: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["communityNamespace", "suppliedFieldCode", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit community-supplied metadata field code by namespace and version without imposing a vocabulary. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { communityNamespace, suppliedFieldCode, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(communityNamespace.length > 0, "communityNamespace");
    H.domain(suppliedFieldCode.length > 0, "suppliedFieldCode");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([
        communityNamespace,
        suppliedFieldCode,
        sourceVersion,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    communityNamespace: "COMM17",
    suppliedFieldCode: "FIELD2",
    sourceVersion: "v2",
  },
  output: { token: '["COMM17","FIELD2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const communitySuppliedMetadataNamespaceCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["indigenous-studies", "indigenous studies", "humanities"],
        keywords: ["indigenous studies", "humanities"],
      },
      id: "indigenous-studies/community-supplied-metadata-namespace-code",
      title: "Community Supplied Metadata Namespace Code",
      description:
        "Qualify an explicit community-supplied metadata field code by namespace and version without imposing a vocabulary.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          communityNamespace: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedFieldCode: { type: "string", maxLength: 8192, minLength: 1 },
          sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["communityNamespace", "suppliedFieldCode", "sourceVersion"],
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
            id: "communityNamespace",
            label: "Community Namespace",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedFieldCode",
            label: "Supplied Field Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceVersion",
            label: "Source Version",
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
export const run = communitySuppliedMetadataNamespaceCodeTool.execute;
export default communitySuppliedMetadataNamespaceCodeTool;
