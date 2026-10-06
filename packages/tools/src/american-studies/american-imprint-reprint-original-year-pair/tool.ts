import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationId: string;
  readonly originalYearText: string;
  readonly reprintYearText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationId: { type: "string", maxLength: 8192, minLength: 1 },
    originalYearText: { type: "string", maxLength: 8192, minLength: 1 },
    reprintYearText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["publicationId", "originalYearText", "reprintYearText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicitly transcribed original and reprint years without inferring publication chronology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationId, originalYearText, reprintYearText } = request;
  const compute = (): Output => {
    H.domain(publicationId.length > 0, "publicationId");
    H.domain(originalYearText.length > 0, "originalYearText");
    H.domain(reprintYearText.length > 0, "reprintYearText");
    return {
      token: JSON.stringify([publicationId, originalYearText, reprintYearText]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    publicationId: "PUB17",
    originalYearText: "1850",
    reprintYearText: "1950",
  },
  output: { token: '["PUB17","1850","1950"]' },
} satisfies ToolExample<Input, Output>;
export const americanImprintReprintOriginalYearPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["american-studies", "american studies", "humanities"],
        keywords: ["american studies", "humanities"],
      },
      id: "american-studies/american-imprint-reprint-original-year-pair",
      title: "American Imprint Reprint Original Year Pair",
      description:
        "Pair explicitly transcribed original and reprint years without inferring publication chronology.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          publicationId: { type: "string", maxLength: 8192, minLength: 1 },
          originalYearText: { type: "string", maxLength: 8192, minLength: 1 },
          reprintYearText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["publicationId", "originalYearText", "reprintYearText"],
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
            id: "originalYearText",
            label: "Original Year Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "reprintYearText",
            label: "Reprint Year Text",
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
export const run = americanImprintReprintOriginalYearPairTool.execute;
export default americanImprintReprintOriginalYearPairTool;
