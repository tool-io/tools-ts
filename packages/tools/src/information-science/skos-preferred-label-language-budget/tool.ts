import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labels: readonly string[];
  readonly languages: readonly string[];
};
export type Output = {
  readonly duplicateLanguages: readonly string[];
  readonly maximumPerLanguage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    languages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["labels", "languages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    duplicateLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    maximumPerLanguage: { type: "integer" },
  },
  required: ["duplicateLanguages", "maximumPerLanguage"],
} as const;
/** Count distinct supplied preferred-label literals per case-insensitive language tag, collapsing duplicate RDF literal rows. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labels, languages } = request;
  const compute = (): Output => {
    H.sameLength(labels, languages);
    const groups = new Map<string, Set<string>>();
    languages.forEach((x, i) => {
      const key = x.toLowerCase(),
        set = groups.get(key) ?? new Set<string>();
      set.add(labels[i]);
      groups.set(key, set);
    });
    return {
      duplicateLanguages: [...groups]
        .filter(([, s]) => s.size > 1)
        .map(([key]) => key),
      maximumPerLanguage: Math.max(
        0,
        ...[...groups.values()].map((s) => s.size),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labels: ["one", "two", "trois"], languages: ["en", "EN", "fr"] },
  output: { duplicateLanguages: ["en"], maximumPerLanguage: 2 },
} satisfies ToolExample<Input, Output>;
export const skosPreferredLabelLanguageBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/skos-preferred-label-language-budget",
    title: "SKOS Preferred Label Language Budget Tool",
    description:
      "Count distinct supplied preferred-label literals per case-insensitive language tag, collapsing duplicate RDF literal rows.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        languages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["labels", "languages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        duplicateLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        maximumPerLanguage: { type: "integer" },
      },
      required: ["duplicateLanguages", "maximumPerLanguage"],
    },
    ports: {
      inputs: [
        {
          id: "labels",
          label: "Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "languages",
          label: "Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "duplicateLanguages",
          label: "Duplicate Languages",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "maximumPerLanguage",
          label: "Maximum Per Language",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = skosPreferredLabelLanguageBudgetTool.execute;
export default skosPreferredLabelLanguageBudgetTool;
