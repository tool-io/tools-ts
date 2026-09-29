import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preferred: readonly string[];
  readonly alternative: readonly string[];
  readonly languages: readonly string[];
  readonly alternativeLanguages: readonly string[];
};
export type Output = {
  readonly conflicts: readonly string[];
  readonly duplicatePreferredLanguages: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preferred: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    alternative: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    languages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    alternativeLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["preferred", "alternative", "languages", "alternativeLanguages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conflicts: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    duplicatePreferredLanguages: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["conflicts", "duplicatePreferredLanguages"],
} as const;
/** Audit SKOS preferred/alternative label disjointness using lexical text plus case-insensitive language tags, and distinct preferred labels per language. Identical repeated preferred literals are deduplicated; no language registry lookup or concept equivalence is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preferred, alternative, languages, alternativeLanguages } = request;
  const compute = (): Output => {
    H.domain(
      preferred.length === languages.length &&
        alternative.length === alternativeLanguages.length,
      "languages",
    );
    H.domain(
      [...languages, ...alternativeLanguages].every((x) =>
        /^[A-Za-z]+(?:-[A-Za-z0-9]+)*(?![\s\S])/.test(x),
      ),
      "languages",
    );
    const keys = alternative.map((x, i) =>
      JSON.stringify([x, alternativeLanguages[i].toLowerCase()]),
    );
    const conflicts = [
        ...new Set(
          preferred.filter((x, i) =>
            keys.includes(JSON.stringify([x, languages[i].toLowerCase()])),
          ),
        ),
      ],
      seen = new Map<string, string>(),
      duplicates = new Set<string>();
    for (let i = 0; i < preferred.length; i++) {
      const language = languages[i].toLowerCase();
      const prior = seen.get(language);
      if (prior !== undefined && prior !== preferred[i])
        duplicates.add(language);
      else seen.set(language, preferred[i]);
    }
    return { conflicts, duplicatePreferredLanguages: [...duplicates] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preferred: ["cat", "chat"],
    alternative: ["cat", "feline"],
    languages: ["en", "fr"],
    alternativeLanguages: ["en", "en"],
  },
  output: { conflicts: ["cat"], duplicatePreferredLanguages: [] },
} satisfies ToolExample<Input, Output>;
export const thesaurusPreferredAltLabelConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/thesaurus-preferred-alt-label-conflict",
    title: "Thesaurus Preferred Alt Label Conflict Tool",
    description:
      "Audit SKOS preferred/alternative label disjointness using lexical text plus case-insensitive language tags, and distinct preferred labels per language. Identical repeated preferred literals are deduplicated; no language registry lookup or concept equivalence is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preferred: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        alternative: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        languages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        alternativeLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "preferred",
        "alternative",
        "languages",
        "alternativeLanguages",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conflicts: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        duplicatePreferredLanguages: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["conflicts", "duplicatePreferredLanguages"],
    },
    ports: {
      inputs: [
        {
          id: "preferred",
          label: "Preferred",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "alternative",
          label: "Alternative",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "languages",
          label: "Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "alternativeLanguages",
          label: "Alternative Languages",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "conflicts",
          label: "Conflicts",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "duplicatePreferredLanguages",
          label: "Duplicate Preferred Languages",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = thesaurusPreferredAltLabelConflictTool.execute;
export default thesaurusPreferredAltLabelConflictTool;
