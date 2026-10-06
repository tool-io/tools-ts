import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedLanguages: readonly string[];
  readonly sourceLanguages: readonly string[];
};
export type Output = {
  readonly allCovered: boolean;
  readonly missingLanguages: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requestedLanguages", "sourceLanguages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allCovered: { type: "boolean" },
    missingLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["allCovered", "missingLanguages"],
} as const;
/** Compare explicit requested and source language-code lists without inferring linguistic representativeness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedLanguages, sourceLanguages } = request;
  const compute = (): Output => {
    const missingLanguages = [...new Set(requestedLanguages)].filter(
      (v) => !sourceLanguages.includes(v),
    );
    return { allCovered: missingLanguages.length === 0, missingLanguages };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedLanguages: ["en", "fr"], sourceLanguages: ["en"] },
  output: { allCovered: false, missingLanguages: ["fr"] },
} satisfies ToolExample<Input, Output>;
export const regionalSourceLanguageCoverageFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/regional-source-language-coverage-flag",
    title: "Regional Source Language Coverage Flag",
    description:
      "Compare explicit requested and source language-code lists without inferring linguistic representativeness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requestedLanguages", "sourceLanguages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allCovered: { type: "boolean" },
        missingLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["allCovered", "missingLanguages"],
    },
    ports: {
      inputs: [
        {
          id: "requestedLanguages",
          label: "Requested Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceLanguages",
          label: "Source Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "allCovered",
          label: "All Covered",
          valueType: { type: "boolean" },
        },
        {
          id: "missingLanguages",
          label: "Missing Languages",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = regionalSourceLanguageCoverageFlagTool.execute;
export default regionalSourceLanguageCoverageFlagTool;
