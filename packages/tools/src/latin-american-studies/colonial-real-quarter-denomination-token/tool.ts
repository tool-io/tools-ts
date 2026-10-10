import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedDenominationText: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDenominationText: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedDenominationText", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit colonial denomination transcription and source without converting historical money. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedDenominationText, source } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedDenominationText.length > 0, "suppliedDenominationText");
    H.domain(source.length > 0, "source");
    return {
      token: JSON.stringify([recordId, suppliedDenominationText, source]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedDenominationText: "quarter real notation",
    source: "Source A",
  },
  output: { token: '["R17","quarter real notation","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const colonialRealQuarterDenominationTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: [
          "latin-american-studies",
          "latin american studies",
          "humanities",
        ],
        keywords: ["latin american studies", "humanities"],
      },
      id: "latin-american-studies/colonial-real-quarter-denomination-token",
      title: "Colonial Real Quarter Denomination Token",
      description:
        "Preserve an explicit colonial denomination transcription and source without converting historical money.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedDenominationText: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedDenominationText", "source"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedDenominationText",
            label: "Supplied Denomination Text",
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
export const run = colonialRealQuarterDenominationTokenTool.execute;
export default colonialRealQuarterDenominationTokenTool;
