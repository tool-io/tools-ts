import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly identifierText: string;
  readonly suppliedCheckDigit: string;
  readonly algorithmSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identifierText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedCheckDigit: { type: "string", maxLength: 8192, minLength: 1 },
    algorithmSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["identifierText", "suppliedCheckDigit", "algorithmSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit authority identifier check-digit transcription and algorithm source without inventing or applying a registry algorithm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifierText, suppliedCheckDigit, algorithmSource } = request;
  const compute = (): Output => {
    H.domain(identifierText.length > 0, "identifierText");
    H.domain(suppliedCheckDigit.length > 0, "suppliedCheckDigit");
    H.domain(algorithmSource.length > 0, "algorithmSource");
    return {
      token: JSON.stringify([
        identifierText,
        suppliedCheckDigit,
        algorithmSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    identifierText: "00124",
    suppliedCheckDigit: "7",
    algorithmSource: "registry rule R4",
  },
  output: { token: '["00124","7","registry rule R4"]' },
} satisfies ToolExample<Input, Output>;
export const authorityIdentifierCheckDigitSourceRowTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information-science/authority-identifier-check-digit-source-row",
      title: "Authority Identifier Check Digit Source Row Tool",
      description:
        "Record an explicit authority identifier check-digit transcription and algorithm source without inventing or applying a registry algorithm.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          identifierText: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedCheckDigit: { type: "string", maxLength: 8192, minLength: 1 },
          algorithmSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["identifierText", "suppliedCheckDigit", "algorithmSource"],
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
            id: "identifierText",
            label: "Identifier Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedCheckDigit",
            label: "Supplied Check Digit",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "algorithmSource",
            label: "Algorithm Source",
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
export const run = authorityIdentifierCheckDigitSourceRowTool.execute;
export default authorityIdentifierCheckDigitSourceRowTool;
