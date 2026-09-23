import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = { readonly mappingQuality: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mappingQuality: { type: "integer" } },
  required: ["mappingQuality"],
} as const;
/** Decode the mapping-quality character immediately following a pileup read-start caret using Phred+33. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    H.domain(token.length === 2 && token[0] === "^");
    const mappingQuality = token.charCodeAt(1) - 33;
    H.integer(mappingQuality, 0, 93);
    return { mappingQuality };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "^I" },
  output: { mappingQuality: 40 },
} satisfies ToolExample<Input, Output>;
export const pileupReadstartQualitySymbolTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioinformatics/pileup-readstart-quality-symbol",
    title: "Pileup Readstart Quality Symbol Tool",
    description:
      "Decode the mapping-quality character immediately following a pileup read-start caret using Phred+33.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mappingQuality: { type: "integer" } },
      required: ["mappingQuality"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "mappingQuality",
          label: "Mapping Quality",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pileupReadstartQualitySymbolTool.execute;
export default pileupReadstartQualitySymbolTool;
