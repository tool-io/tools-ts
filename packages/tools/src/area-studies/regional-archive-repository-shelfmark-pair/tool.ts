import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly repositoryId: string;
  readonly shelfmark: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repositoryId: { type: "string", maxLength: 8192, minLength: 1 },
    shelfmark: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["repositoryId", "shelfmark"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an exact regional archive repository and shelfmark pair without resolving holdings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { repositoryId, shelfmark } = request;
  const compute = (): Output => {
    H.domain(repositoryId.length > 0, "repositoryId");
    H.domain(shelfmark.length > 0, "shelfmark");
    return { token: JSON.stringify([repositoryId, shelfmark]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { repositoryId: "AR17", shelfmark: "MS 24/3" },
  output: { token: '["AR17","MS 24/3"]' },
} satisfies ToolExample<Input, Output>;
export const regionalArchiveRepositoryShelfmarkPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["area-studies", "area studies", "humanities"],
        keywords: ["area studies", "humanities"],
      },
      id: "area-studies/regional-archive-repository-shelfmark-pair",
      title: "Regional Archive Repository Shelfmark Pair",
      description:
        "Encode an exact regional archive repository and shelfmark pair without resolving holdings.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          repositoryId: { type: "string", maxLength: 8192, minLength: 1 },
          shelfmark: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["repositoryId", "shelfmark"],
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
            id: "repositoryId",
            label: "Repository Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "shelfmark",
            label: "Shelfmark",
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
export const run = regionalArchiveRepositoryShelfmarkPairTool.execute;
export default regionalArchiveRepositoryShelfmarkPairTool;
