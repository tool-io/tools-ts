import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceWords: number;
  readonly expansionFactor: number;
  readonly wordsPerPage: number;
  readonly languages: number;
  readonly copiesPerLanguage: number;
};
export type Output = {
  readonly translatedWords: number;
  readonly pagesPerCopy: number;
  readonly totalPages: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceWords: { type: "integer", minimum: 0 },
    expansionFactor: { type: "number", exclusiveMinimum: 0 },
    wordsPerPage: { type: "integer", minimum: 1 },
    languages: { type: "integer", minimum: 0 },
    copiesPerLanguage: { type: "integer", minimum: 0 },
  },
  required: [
    "sourceWords",
    "expansionFactor",
    "wordsPerPage",
    "languages",
    "copiesPerLanguage",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    translatedWords: { type: "number" },
    pagesPerCopy: { type: "integer" },
    totalPages: { type: "integer" },
  },
  required: ["translatedWords", "pagesPerCopy", "totalPages"],
} as const;
/** Calculate pharmacy counseling translated handout expansion from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    sourceWords,
    expansionFactor,
    wordsPerPage,
    languages,
    copiesPerLanguage,
  } = request;
  const compute = (): Output => {
    H.integer(sourceWords, 0);
    H.positive(expansionFactor);
    H.integer(wordsPerPage, 1);
    H.integer(languages, 0);
    H.integer(copiesPerLanguage, 0);
    return {
      translatedWords: sourceWords * expansionFactor,
      pagesPerCopy: Math.ceil((sourceWords * expansionFactor) / wordsPerPage),
      totalPages:
        Math.ceil((sourceWords * expansionFactor) / wordsPerPage) *
        languages *
        copiesPerLanguage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceWords: 1000,
    expansionFactor: 1.2,
    wordsPerPage: 500,
    languages: 3,
    copiesPerLanguage: 10,
  },
  output: { translatedWords: 1200, pagesPerCopy: 3, totalPages: 90 },
} satisfies ToolExample<Input, Output>;
export const pharmacyCounselingTranslatedHandoutExpansionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "clinical-pharmacy/pharmacy-counseling-translated-handout-expansion",
      title: "Pharmacy Counseling Translated Handout Expansion Tool",
      description:
        "Calculate pharmacy counseling translated handout expansion from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sourceWords: { type: "integer", minimum: 0 },
          expansionFactor: { type: "number", exclusiveMinimum: 0 },
          wordsPerPage: { type: "integer", minimum: 1 },
          languages: { type: "integer", minimum: 0 },
          copiesPerLanguage: { type: "integer", minimum: 0 },
        },
        required: [
          "sourceWords",
          "expansionFactor",
          "wordsPerPage",
          "languages",
          "copiesPerLanguage",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          translatedWords: { type: "number" },
          pagesPerCopy: { type: "integer" },
          totalPages: { type: "integer" },
        },
        required: ["translatedWords", "pagesPerCopy", "totalPages"],
      },
      ports: {
        inputs: [
          {
            id: "sourceWords",
            label: "Source Words",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "expansionFactor",
            label: "Expansion Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "wordsPerPage",
            label: "Words Per Page",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "languages",
            label: "Languages",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "copiesPerLanguage",
            label: "Copies Per Language",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "translatedWords",
            label: "Translated Words",
            valueType: { type: "number" },
          },
          {
            id: "pagesPerCopy",
            label: "Pages Per Copy",
            valueType: { type: "integer" },
          },
          {
            id: "totalPages",
            label: "Total Pages",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacyCounselingTranslatedHandoutExpansionTool.execute;
export default pharmacyCounselingTranslatedHandoutExpansionTool;
