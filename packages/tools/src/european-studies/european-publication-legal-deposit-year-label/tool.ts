import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationId: string;
  readonly suppliedDepositYear: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDepositYear: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["publicationId", "suppliedDepositYear", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit legal-deposit year transcription without treating it as the publication year. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationId, suppliedDepositYear, source } = request;
  const compute = (): Output => {
    H.domain(publicationId.length > 0, "publicationId");
    H.domain(suppliedDepositYear.length > 0, "suppliedDepositYear");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([publicationId, suppliedDepositYear, source]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    publicationId: "PUB17",
    suppliedDepositYear: "1950",
    source: "Source A",
  },
  output: { token: '["PUB17","1950","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const europeanPublicationLegalDepositYearLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["european-studies", "european studies", "humanities"],
        keywords: ["european studies", "humanities"],
      },
      id: "european-studies/european-publication-legal-deposit-year-label",
      title: "European Publication Legal Deposit Year Label",
      description:
        "Preserve an explicit legal-deposit year transcription without treating it as the publication year.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          publicationId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedDepositYear: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["publicationId", "suppliedDepositYear", "source"],
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
            id: "publicationId",
            label: "Publication Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedDepositYear",
            label: "Supplied Deposit Year",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
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
export const run = europeanPublicationLegalDepositYearLabelTool.execute;
export default europeanPublicationLegalDepositYearLabelTool;
