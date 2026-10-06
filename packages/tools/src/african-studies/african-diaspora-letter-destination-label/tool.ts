import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly letterId: string;
  readonly suppliedDestination: string;
  readonly source: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    letterId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedDestination: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["letterId", "suppliedDestination", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit letter destination transcription by source without locating people or inferring migration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { letterId, suppliedDestination, source } = request;
  const compute = (): Output => {
    H.domain(letterId.length > 0, "letterId");
    H.domain(suppliedDestination.length > 0, "suppliedDestination");
    H.domain(source.length > 0, "source");
    return { token: JSON.stringify([letterId, suppliedDestination, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    letterId: "L17",
    suppliedDestination: "Destination A",
    source: "Envelope A",
  },
  output: { token: '["L17","Destination A","Envelope A"]' },
} satisfies ToolExample<Input, Output>;
export const africanDiasporaLetterDestinationLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["african-studies", "african studies", "humanities"],
        keywords: ["african studies", "humanities"],
      },
      id: "african-studies/african-diaspora-letter-destination-label",
      title: "African Diaspora Letter Destination Label",
      description:
        "Qualify an explicit letter destination transcription by source without locating people or inferring migration.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          letterId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedDestination: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          source: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["letterId", "suppliedDestination", "source"],
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
            id: "letterId",
            label: "Letter Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedDestination",
            label: "Supplied Destination",
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
export const run = africanDiasporaLetterDestinationLabelTool.execute;
export default africanDiasporaLetterDestinationLabelTool;
