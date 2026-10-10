import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resourceId: string;
  readonly suppliedAccessDateText: string;
  readonly permissionReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resourceId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAccessDateText: { type: "string", maxLength: 8192, minLength: 1 },
    permissionReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resourceId", "suppliedAccessDateText", "permissionReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit community-resource access-date and permission-reference metadata without granting resource access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resourceId, suppliedAccessDateText, permissionReference } = request;
  const compute = (): Output => {
    H.domain(resourceId.length > 0, "resourceId");
    H.domain(suppliedAccessDateText.length > 0, "suppliedAccessDateText");
    H.domain(permissionReference.length > 0, "permissionReference");
    return {
      token: JSON.stringify([
        resourceId,
        suppliedAccessDateText,
        permissionReference,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resourceId: "RES17",
    suppliedAccessDateText: "2026-11-01",
    permissionReference: "PERM2",
  },
  output: { token: '["RES17","2026-11-01","PERM2"]' },
} satisfies ToolExample<Input, Output>;
export const communityResourceExplicitAccessDateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["indigenous-studies", "indigenous studies", "humanities"],
        keywords: ["indigenous studies", "humanities"],
      },
      id: "indigenous-studies/community-resource-explicit-access-date",
      title: "Community Resource Explicit Access Date",
      description:
        "Preserve explicit community-resource access-date and permission-reference metadata without granting resource access.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resourceId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedAccessDateText: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          permissionReference: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: [
          "resourceId",
          "suppliedAccessDateText",
          "permissionReference",
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
            id: "resourceId",
            label: "Resource Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedAccessDateText",
            label: "Supplied Access Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "permissionReference",
            label: "Permission Reference",
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
export const run = communityResourceExplicitAccessDateTool.execute;
export default communityResourceExplicitAccessDateTool;
