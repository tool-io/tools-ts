import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string; readonly separator: string };
export type Output = { readonly site: string; readonly laterality: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["token", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    site: { type: "string", maxLength: 8192 },
    laterality: { type: "string", maxLength: 8192 },
  },
  required: ["site", "laterality"],
} as const;
/** Split an explicitly two-part skin-biopsy site/laterality token using a literal separator without inferring anatomy from free text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, separator } = request;
  const compute = (): Output => {
    H.domain(separator.length > 0, "separator");
    const parts = token.split(separator);
    H.domain(parts.length === 2 && parts.every((v) => v.length > 0), "token");
    return { site: parts[0], laterality: parts[1] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "forearm|left", separator: "|" },
  output: { site: "forearm", laterality: "left" },
} satisfies ToolExample<Input, Output>;
export const parserSkinBiopsyLocationTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dermatology", "health and medicine"],
      keywords: ["dermatology", "health and medicine"],
    },
    id: "dermatology/parser-skin-biopsy-location-token",
    title: "Parser Skin Biopsy Location Token",
    description:
      "Split an explicitly two-part skin-biopsy site/laterality token using a literal separator without inferring anatomy from free text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["token", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        site: { type: "string", maxLength: 8192 },
        laterality: { type: "string", maxLength: 8192 },
      },
      required: ["site", "laterality"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "site", label: "Site", valueType: { type: "string" } },
        {
          id: "laterality",
          label: "Laterality",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = parserSkinBiopsyLocationTokenTool.execute;
export default parserSkinBiopsyLocationTokenTool;
