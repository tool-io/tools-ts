import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedAmountText: string;
  readonly currencySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAmountText: { type: "string", maxLength: 8192, minLength: 1 },
    currencySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedAmountText", "currencySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit historical franc-centime notation transcription and source without converting currencies or regimes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedAmountText, currencySource } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedAmountText.length > 0, "suppliedAmountText");
    H.domain(currencySource.length > 0, "currencySource");
    return {
      token: JSON.stringify([recordId, suppliedAmountText, currencySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedAmountText: "3 fr. 25 c.",
    currencySource: "Source A",
  },
  output: { token: '["R17","3 fr. 25 c.","Source A"]' },
} satisfies ToolExample<Input, Output>;
export const historicalFrancCentimeNotationTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["european-studies", "european studies", "humanities"],
        keywords: ["european studies", "humanities"],
      },
      id: "european-studies/historical-franc-centime-notation-token",
      title: "Historical Franc Centime Notation Token",
      description:
        "Preserve an explicit historical franc-centime notation transcription and source without converting currencies or regimes.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedAmountText: { type: "string", maxLength: 8192, minLength: 1 },
          currencySource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedAmountText", "currencySource"],
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
            id: "suppliedAmountText",
            label: "Supplied Amount Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "currencySource",
            label: "Currency Source",
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
export const run = historicalFrancCentimeNotationTokenTool.execute;
export default historicalFrancCentimeNotationTokenTool;
