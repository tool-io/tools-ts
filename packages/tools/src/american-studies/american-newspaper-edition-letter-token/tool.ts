import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly newspaperId: string;
  readonly issueDateText: string;
  readonly suppliedEditionLetter: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newspaperId: { type: "string", maxLength: 8192, minLength: 1 },
    issueDateText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedEditionLetter: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["newspaperId", "issueDateText", "suppliedEditionLetter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit newspaper edition-letter transcription by issue without resolving publication history. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { newspaperId, issueDateText, suppliedEditionLetter } = request;
  const compute = (): Output => {
    H.domain(newspaperId.length > 0, "newspaperId");
    H.domain(issueDateText.length > 0, "issueDateText");
    H.domain(suppliedEditionLetter.length > 0, "suppliedEditionLetter");
    return {
      token: JSON.stringify([
        newspaperId,
        issueDateText,
        suppliedEditionLetter,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    newspaperId: "NEWS17",
    issueDateText: "1950-01-02",
    suppliedEditionLetter: "B",
  },
  output: { token: '["NEWS17","1950-01-02","B"]' },
} satisfies ToolExample<Input, Output>;
export const americanNewspaperEditionLetterTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["american-studies", "american studies", "humanities"],
        keywords: ["american studies", "humanities"],
      },
      id: "american-studies/american-newspaper-edition-letter-token",
      title: "American Newspaper Edition Letter Token",
      description:
        "Qualify an explicit newspaper edition-letter transcription by issue without resolving publication history.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          newspaperId: { type: "string", maxLength: 8192, minLength: 1 },
          issueDateText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedEditionLetter: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["newspaperId", "issueDateText", "suppliedEditionLetter"],
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
            id: "newspaperId",
            label: "Newspaper Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "issueDateText",
            label: "Issue Date Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedEditionLetter",
            label: "Supplied Edition Letter",
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
export const run = americanNewspaperEditionLetterTokenTool.execute;
export default americanNewspaperEditionLetterTokenTool;
