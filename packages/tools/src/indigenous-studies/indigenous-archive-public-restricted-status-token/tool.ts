import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedAccessStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAccessStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["public", "restricted", "closed", "unknown"],
    },
  },
  required: ["recordId", "suppliedAccessStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied archive access status without granting access or interpreting community permissions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedAccessStatus } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["public", "restricted", "closed", "unknown"].includes(
        suppliedAccessStatus,
      ),
      "suppliedAccessStatus",
    );
    return { label: recordId + " [" + suppliedAccessStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", suppliedAccessStatus: "restricted" },
  output: { label: "R17 [restricted]" },
} satisfies ToolExample<Input, Output>;
export const indigenousArchivePublicRestrictedStatusTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["indigenous-studies", "indigenous studies", "humanities"],
        keywords: ["indigenous studies", "humanities"],
      },
      id: "indigenous-studies/indigenous-archive-public-restricted-status-token",
      title: "Indigenous Archive Public Restricted Status Token",
      description:
        "Label an explicitly supplied archive access status without granting access or interpreting community permissions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedAccessStatus: {
            type: "string",
            maxLength: 8192,
            enum: ["public", "restricted", "closed", "unknown"],
          },
        },
        required: ["recordId", "suppliedAccessStatus"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
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
            id: "suppliedAccessStatus",
            label: "Supplied Access Status",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = indigenousArchivePublicRestrictedStatusTokenTool.execute;
export default indigenousArchivePublicRestrictedStatusTokenTool;
