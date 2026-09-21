import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedLanguage: string;
  readonly languages: readonly string[];
  readonly caseSensitive: boolean;
};
export type Output = { readonly available: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedLanguage: { type: "string", maxLength: 8192 },
    languages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    caseSensitive: { type: "boolean" },
  },
  required: ["requestedLanguage", "languages", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "boolean" } },
  required: ["available"],
} as const;
/** Calculate resource language availability bit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedLanguage, languages, caseSensitive } = request;
  const compute = (): Output => {
    return {
      available: languages
        .map((x) => (caseSensitive ? x : x.toLowerCase()))
        .includes(
          caseSensitive ? requestedLanguage : requestedLanguage.toLowerCase(),
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedLanguage: "EN",
    languages: ["en", "fr"],
    caseSensitive: false,
  },
  output: { available: true },
} satisfies ToolExample<Input, Output>;
export const resourceLanguageAvailabilityBitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/resource-language-availability-bit",
    title: "Resource Language Availability Bit Tool",
    description:
      "Calculate resource language availability bit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedLanguage: { type: "string", maxLength: 8192 },
        languages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        caseSensitive: { type: "boolean" },
      },
      required: ["requestedLanguage", "languages", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { available: { type: "boolean" } },
      required: ["available"],
    },
    ports: {
      inputs: [
        {
          id: "requestedLanguage",
          label: "Requested Language",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "languages",
          label: "Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "available", label: "Available", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = resourceLanguageAvailabilityBitTool.execute;
export default resourceLanguageAvailabilityBitTool;
