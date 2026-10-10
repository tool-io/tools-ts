import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableLanguages: readonly string[];
  readonly labels: readonly string[];
  readonly preferredLanguage: string;
  readonly fallbackLanguage: string;
};
export type Output = {
  readonly selectedLabel: string;
  readonly selectedLanguage: string;
  readonly found: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    preferredLanguage: { type: "string", maxLength: 8192 },
    fallbackLanguage: { type: "string", maxLength: 8192 },
  },
  required: [
    "availableLanguages",
    "labels",
    "preferredLanguage",
    "fallbackLanguage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selectedLabel: { type: "string", maxLength: 8192 },
    selectedLanguage: { type: "string", maxLength: 8192 },
    found: { type: "boolean" },
  },
  required: ["selectedLabel", "selectedLanguage", "found"],
} as const;
/** Choose an exact preferred language label or explicit fallback from aligned unique language tags without prefix matching or translation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableLanguages, labels, preferredLanguage, fallbackLanguage } =
    request;
  const compute = (): Output => {
    H.domain(availableLanguages.length === labels.length, "labels");
    H.domain(
      new Set(availableLanguages).size === availableLanguages.length,
      "availableLanguages",
    );
    return (() => {
      const preferred = availableLanguages.indexOf(preferredLanguage),
        index =
          preferred >= 0
            ? preferred
            : availableLanguages.indexOf(fallbackLanguage);
      return {
        selectedLabel: index >= 0 ? labels[index] : "",
        selectedLanguage: index >= 0 ? availableLanguages[index] : "",
        found: index >= 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableLanguages: ["en", "fr"],
    labels: ["River", "Rivière"],
    preferredLanguage: "de",
    fallbackLanguage: "fr",
  },
  output: { selectedLabel: "Rivière", selectedLanguage: "fr", found: true },
} satisfies ToolExample<Input, Output>;
export const ontologyLabelLanguageFallbackChoiceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information-science/ontology-label-language-fallback-choice",
      title: "Ontology Label Language Fallback Choice Tool",
      description:
        "Choose an exact preferred language label or explicit fallback from aligned unique language tags without prefix matching or translation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableLanguages: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          labels: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          preferredLanguage: { type: "string", maxLength: 8192 },
          fallbackLanguage: { type: "string", maxLength: 8192 },
        },
        required: [
          "availableLanguages",
          "labels",
          "preferredLanguage",
          "fallbackLanguage",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          selectedLabel: { type: "string", maxLength: 8192 },
          selectedLanguage: { type: "string", maxLength: 8192 },
          found: { type: "boolean" },
        },
        required: ["selectedLabel", "selectedLanguage", "found"],
      },
      ports: {
        inputs: [
          {
            id: "availableLanguages",
            label: "Available Languages",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "labels",
            label: "Labels",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "preferredLanguage",
            label: "Preferred Language",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "fallbackLanguage",
            label: "Fallback Language",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "selectedLabel",
            label: "Selected Label",
            valueType: { type: "string" },
          },
          {
            id: "selectedLanguage",
            label: "Selected Language",
            valueType: { type: "string" },
          },
          { id: "found", label: "Found", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = ontologyLabelLanguageFallbackChoiceTool.execute;
export default ontologyLabelLanguageFallbackChoiceTool;
